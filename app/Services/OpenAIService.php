<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
    }

    /**
     * Get AI recommendation for planting based on weather forecast
     */
    public function getPlantingRecommendation($farmData, $plantData, $weatherForecast)
    {
        try {
            $prompt = $this->buildPrompt($farmData, $plantData, $weatherForecast);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert agricultural consultant specializing in crop-specific planting strategies. '.
                                   'You understand that different plants (tomatoes, spinach, lettuce, peppers, etc.) have vastly different '.
                                   'temperature, humidity, and weather requirements. Cool-season crops like spinach thrive in temperatures '.
                                   'that would stress warm-season crops like tomatoes. Always tailor your recommendations to the SPECIFIC '.
                                   'plant being discussed, considering its unique temperature tolerance, frost sensitivity, and optimal growing conditions.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.7,
                'max_tokens' => 600,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                return $data['choices'][0]['message']['content'] ?? 'No recommendation available';
            }

            Log::error('OpenAI API Error', ['response' => $response->body()]);

            return null;
        } catch (\Exception $e) {
            Log::error('OpenAI Service Exception', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Build the prompt for OpenAI with plant-specific requirements
     */
    protected function buildPrompt($farmData, $plantData, $weatherForecast)
    {
        $forecastSummary = $this->summarizeForecast($weatherForecast);

        return "You are an expert agricultural consultant with deep knowledge of plant biology and optimal growing conditions.\n\n".
               "FARM DETAILS:\n".
               "- Farm Name: {$farmData['name']}\n".
               "- Location: Latitude {$farmData['latitude']}, Longitude {$farmData['longitude']}\n\n".
               "PLANT TO BE PLANTED:\n".
               "- Plant Name: {$plantData['name']}\n".
               "- Plant Description/Requirements: {$plantData['info']}\n\n".
               "40-DAY WEATHER FORECAST:\n{$forecastSummary}\n\n".
               "INSTRUCTIONS:\n".
               "1. ANALYZE the plant description above to understand this specific plant's needs:\n".
               "   - What temperature range does it prefer?\n".
               "   - Is it a cool-season or warm-season crop?\n".
               "   - What are its frost tolerance and humidity requirements?\n".
               "   - Any special growing conditions mentioned?\n\n".
               "2. USE YOUR AGRICULTURAL KNOWLEDGE about '{$plantData['name']}':\n".
               "   - Consider typical growing requirements for this plant type\n".
               "   - Factor in temperature tolerance, frost sensitivity, and moisture needs\n".
               "   - Think about optimal planting season and conditions\n\n".
               "3. MATCH the weather forecast to plant requirements:\n".
               "   - Identify which days have ideal conditions for THIS specific plant\n".
               "   - Consider temperature, humidity, wind, and precipitation\n".
               "   - Account for plant-specific sensitivities (frost, heat, moisture, etc.)\n\n".
               "PROVIDE A DETAILED RECOMMENDATION:\n".
               "1. Best planting day(s) - List 2-3 specific dates from the forecast\n".
               "2. Why these days are perfect for {$plantData['name']} - Explain how conditions match plant needs\n".
               "3. Plant-specific considerations - Address temperature tolerance, frost risk, moisture, etc.\n".
               "4. Days to AVOID - Identify unsuitable days and explain why (for THIS plant)\n".
               "5. Preparation tips - Any special steps needed for this plant type\n".
               "6. Overall Status - Classify as: OPTIMAL, ACCEPTABLE, or POOR\n\n".
               "CRITICAL: Your analysis must be specific to {$plantData['name']}. Different plants have vastly different needs.\n".
               "Cool-season crops (spinach, lettuce) thrive in 10-20°C while warm-season crops (tomatoes, peppers) need 20-28°C.\n".
               "Base your recommendation on the actual characteristics of {$plantData['name']}.";
    }

    /**
     * Summarize forecast data for the prompt
     */
    protected function summarizeForecast($forecast)
    {
        $summary = '';
        $dayData = [];

        foreach ($forecast as $item) {
            $date = date('Y-m-d', strtotime($item['date']));

            if (! isset($dayData[$date])) {
                $dayData[$date] = [
                    'temps' => [],
                    'humidity' => [],
                    'pressure' => [],
                    'wind' => [],
                ];
            }

            $dayData[$date]['temps'][] = $item['temperature'];
            $dayData[$date]['humidity'][] = $item['humidity'];
            $dayData[$date]['pressure'][] = $item['air_pressure'];
            $dayData[$date]['wind'][] = $item['wind_speed'];
        }

        foreach ($dayData as $date => $data) {
            $avgTemp = round(array_sum($data['temps']) / count($data['temps']), 1);
            $avgHumidity = round(array_sum($data['humidity']) / count($data['humidity']), 1);
            $avgPressure = round(array_sum($data['pressure']) / count($data['pressure']), 1);
            $avgWind = round(array_sum($data['wind']) / count($data['wind']), 1);

            $summary .= "Day {$date}:\n";
            $summary .= "  - Avg Temperature: {$avgTemp}°C\n";
            $summary .= "  - Avg Humidity: {$avgHumidity}%\n";
            $summary .= "  - Avg Air Pressure: {$avgPressure} hPa\n";
            $summary .= "  - Avg Wind Speed: {$avgWind} m/s\n\n";
        }

        return $summary;
    }

    /**
     * Analyze plant image for disease detection
     * 
     * @param string $imagePath Path to the uploaded image file
     * @param string|null $plantName Optional plant name for better context
     * @return array|null Returns diagnosis data or null on error
     */
    public function analyzePlantDisease($imagePath, $plantName = null)
    {
        try {
            // Validate image file exists
            if (!file_exists($imagePath) || !is_readable($imagePath)) {
                Log::error('Plant Disease Image file not accessible', ['path' => $imagePath]);
                return null;
            }

            // Read and encode image to base64
            $imageData = file_get_contents($imagePath);
            if ($imageData === false) {
                Log::error('Failed to read image file', ['path' => $imagePath]);
                return null;
            }
            
            $base64Image = base64_encode($imageData);
            
            // Determine image MIME type
            $imageInfo = @getimagesize($imagePath);
            $mimeType = $imageInfo['mime'] ?? 'image/jpeg';
            
            // Build the prompt for disease detection (v2.6 - Enhanced Target Spot detection with stronger prioritization and clearer distinctions)
            $systemPrompt = 'You are an expert plant pathologist with decades of experience in agricultural diagnostics. '.
                           'You specialize in identifying plant diseases, pest damage, nutrient deficiencies, and physiological disorders. '.
                           'You have extensive knowledge of common plant pathogens (fungal, bacterial, viral), pest damage patterns, '.
                           'and can distinguish between diseases and environmental stress. You provide accurate, actionable diagnoses based on established plant pathology knowledge. '.
                           'You understand that different plant species have specific disease susceptibilities and can identify plant-specific diseases accurately. '.
                           'Your knowledge is based on established plant pathology references including: '.
                           'USDA Agricultural Research Service, Extension services (e.g., Cornell, UC Davis), '.
                           'Plant Pathology textbooks (Agrios, Compendium of Plant Diseases), '.
                           'and peer-reviewed research on plant disease identification and management.';
            
            $userPrompt = "Perform a comprehensive visual analysis of this plant image to identify any health issues.\n\n";
            
            if ($plantName) {
                $userPrompt .= "PLANT SPECIES: {$plantName}\n\n";
                $userPrompt .= "CRITICAL: Consider plant-specific diseases for {$plantName}. For example:\n";
                $userPrompt .= "- Apple/Cedar: Apple Scab, Cedar Apple Rust (NOT the same - distinguish carefully)\n";
                if (stripos($plantName, 'tomato') !== false) {
                    $userPrompt .= "- Tomato: CRITICAL - Target Spot (Corynespora cassiicola) is a COMMON tomato disease. If you see LARGE spots (5-15mm) on tomato leaves, FIRST consider Target Spot - it has DISTINCT TARGET-LIKE concentric rings (alternating dark/light bands creating a bull's-eye pattern). Other diseases: Early Blight (large spots with less defined rings, NOT target-like), Late Blight, Leaf Mold (fuzzy gray mold underneath), Septoria Leaf Spot (SMALL circular spots 1-3mm with pycnidia - MUCH smaller than Target Spot), Bacterial Spot (angular lesions, NO rings), Spider Mites (STIPPLING - tiny yellow/white dots, fine webbing - PEST, NOT disease spots), Tomato Mosaic Virus (mosaic patterns, NOT spots)\n";
                } else {
                    $userPrompt .= "- Tomato: Target Spot (COMMON - large spots with target-like rings), Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Bacterial Spot, Spider Mites, Tomato Mosaic Virus\n";
                }
                $userPrompt .= "- Grape: Esca (Black Measles), Powdery Mildew, Black Rot, Leaf Blight (Isariopsis Leaf Spot), Anthracnose\n";
                $userPrompt .= "- Corn: Northern Leaf Blight (long cigar-shaped lesions), Common Rust (small circular orange-brown pustules), Cercospora Leaf Spot (Gray Leaf Spot - rectangular grayish-brown lesions bounded by veins)\n";
                $userPrompt .= "- Corn: Northern Leaf Blight, Common Rust, Cercospora Leaf Spot\n";
                if (stripos($plantName, 'citrus') !== false || stripos($plantName, 'orange') !== false || stripos($plantName, 'lemon') !== false) {
                    $userPrompt .= "- Citrus: Haunglongbing (Citrus Greening), Citrus Canker (distinct diseases - Greening shows mottling; Canker shows raised lesions)\n";
                } else {
                    $userPrompt .= "- Citrus: Haunglongbing (Citrus Greening), Citrus Canker\n";
                }
                $userPrompt .= "- Soybean: Bacterial Spot, Septoria Leaf Spot, Spider Mites\n\n";
            }
            
            $userPrompt .= "ANALYSIS INSTRUCTIONS:\n".
                          "1. Examine the entire image systematically:\n".
                          "   - Look for discoloration (yellowing, browning, blackening, chlorosis)\n".
                          "   - Check for spots, lesions, or necrotic areas\n".
                          "   - Identify patterns (circular spots, irregular patches, vein patterns, concentric rings)\n".
                          "   - Look for wilting, curling, or deformation\n".
                          "   - Check for powdery or fuzzy growth (fungal signs)\n".
                          "   - Look for holes, chewed edges, or pest damage\n".
                          "   - Assess overall plant vigor and growth patterns\n".
                          "   - Check for subtle symptoms (slight discoloration, early-stage lesions)\n\n".
                          "2. Consider common plant health issues:\n".
                          "   - Fungal diseases (powdery mildew, leaf spot, rust, blight, leaf mold, target spot)\n".
                          "   - Bacterial diseases (bacterial spot, canker, wilt)\n".
                          "   - Viral diseases (mosaic patterns, stunting, leaf curl)\n".
                          "   - Pest damage (aphids, mites, caterpillars, beetles)\n".
                          "   - Nutrient deficiencies (yellowing, interveinal chlorosis)\n".
                          "   - Environmental stress (sunburn, water stress, frost damage)\n".
                          "   - Physiological disorders (edema, tip burn, leaf scorch)\n\n".
                          "3. DIFFERENTIAL DIAGNOSIS - Distinguish between similar diseases:\n".
                          "   (Based on established plant pathology references: USDA ARS, Extension services, Agrios Plant Pathology)\n\n".
                          "   APPLE DISEASES:\n".
                          "   - Cedar Apple Rust vs Apple Scab: These are completely different diseases with distinct visual characteristics. Cedar Apple Rust (Gymnosporangium juniperi-virginianae) produces BRIGHT ORANGE, YELLOW, or RED circular spots on the upper leaf surface, often with raised, cup-like structures (aecial cups) on the underside. The spots are highly visible and colorful - if you see any orange, yellow, or red coloration on apple leaves, it is Cedar Apple Rust. Apple Scab (Venturia inaequalis) produces DARK olive-green to black, velvety, irregular spots with NO orange, yellow, or red coloration whatsoever. Apple Scab spots are always dark-colored (olive-green, brown, or black). The primary distinguishing feature is COLOR: orange/yellow/red = Cedar Apple Rust; dark (olive-green/black) = Apple Scab. Reference: USDA ARS and Extension services emphasize color as the primary diagnostic feature.\n".
                          "   - Black Rot vs Apple Scab: Black Rot has larger, sunken lesions with pycnidia; Apple Scab has velvety, olive-colored spots\n\n".
                          "   TOMATO DISEASES:\n".
                          "   - Early Blight vs Bacterial Spot: Early Blight (Alternaria solani) produces LARGE brown spots with CONCENTRIC RINGS (bull's eye pattern) - the rings are clearly visible. Bacterial Spot (Xanthomonas campestris pv. vesicatoria) produces SMALL, ANGULAR lesions that are WATER-SOAKED in appearance, bounded by leaf veins (creating angular/rectangular shapes), and has NO concentric rings. Key distinction: concentric rings = Early Blight; angular water-soaked lesions = Bacterial Spot. Reference: Research published in Crop Protection (2019) and documented by University of Wisconsin-Madison Plant Disease Diagnostics Clinic distinguish these symptom patterns.\n".
                          "   - Bacterial Spot vs Septoria Leaf Spot: These are COMPLETELY DIFFERENT diseases with distinct causal agents and visual characteristics. Bacterial Spot (Xanthomonas campestris pv. vesicatoria) produces ANGULAR or RECTANGULAR lesions that are bounded by leaf veins, creating angular/rectangular shapes. The lesions are WATER-SOAKED in appearance, often with a greasy appearance, and follow the vein pattern. Septoria Leaf Spot (Septoria lycopersici) produces SMALL CIRCULAR spots (1-3mm in diameter) that are perfectly round or nearly round, with tan-to-gray centers and dark borders, often with tiny black pycnidia (fruiting bodies) visible in the center. The key distinction is SHAPE: angular/rectangular lesions that follow veins = Bacterial Spot; small perfectly circular spots with pycnidia = Septoria. CRITICAL: If lesions are angular or rectangular (bounded by veins), it is ALWAYS Bacterial Spot, NOT Septoria. If lesions are circular with tan-gray centers and pycnidia dots, it is Septoria. Reference: Research published in Crop Protection (2019) evaluating organic disease control on tomato foliar diseases, and documented by University of Wisconsin-Madison Plant Disease Diagnostics Clinic, Michigan State University Plant & Pest Diagnostics, and Oklahoma State University Extension clearly distinguish bacterial angular lesions (Xanthomonas) from fungal circular spots with pycnidia (Septoria lycopersici).\n".
                          "   - Early Blight vs Septoria Leaf Spot: Early Blight (Alternaria solani) has LARGE brown spots (10-15mm) with CONCENTRIC RINGS. Septoria Leaf Spot (Septoria lycopersici) has SMALL circular spots (1-3mm) with tan-to-gray centers and dark borders, often with tiny black pycnidia dots. Key distinction: large spots with rings = Early Blight; small circular spots (1-3mm) with pycnidia = Septoria.\n".
                          "   - Early Blight vs Target Spot: Early Blight has irregular brown spots with less defined concentric rings. Target Spot has DISTINCT TARGET-LIKE concentric rings with alternating dark/light bands. Key distinction: less defined rings = Early Blight; clear target pattern with alternating bands = Target Spot.\n".
                          "   - Target Spot vs Early Blight: Target Spot (Corynespora cassiicola) has DISTINCT TARGET-LIKE concentric rings with alternating dark and light bands creating a bull's-eye or target pattern. The rings are clearly visible and form a circular target appearance. Early Blight (Alternaria solani) has irregular brown spots with concentric rings but the rings are less defined and do NOT form a clear target pattern. Key distinction: clear target-like pattern with alternating bands = Target Spot; irregular spots with less defined rings = Early Blight. Reference: Research on tomato foliar diseases distinguishes target-like patterns from general concentric ring patterns.\n".
                          "   - Target Spot vs Septoria Leaf Spot: These are COMPLETELY DIFFERENT diseases with COMPLETELY DIFFERENT visual characteristics. Target Spot (Corynespora cassiicola) produces LARGE spots (5-15mm in diameter) with DISTINCT TARGET-LIKE concentric rings - the rings are ALTERNATING DARK AND LIGHT BANDS creating a clear BULL'S-EYE or TARGET pattern that looks like a shooting target. The spots are LARGE (much larger than Septoria) and the TARGET PATTERN (alternating bands) is the PRIMARY diagnostic feature. Septoria Leaf Spot (Septoria lycopersici) produces SMALL CIRCULAR spots (1-3mm in diameter - MUCH SMALLER than Target Spot) with tan-to-gray centers and dark borders, often with tiny black pycnidia (fruiting bodies) visible in the center. Septoria spots are SMALL, CIRCULAR, and have pycnidia dots - they do NOT have target-like alternating bands. The key distinctions are: (1) SIZE: Target Spot = LARGE (5-15mm); Septoria = SMALL (1-3mm). (2) PATTERN: Target Spot = TARGET-LIKE alternating dark/light bands (bull's-eye); Septoria = small circular spots with pycnidia (NO target pattern). (3) APPEARANCE: Target Spot looks like a shooting target with rings; Septoria looks like small dots with dark centers. CRITICAL DECISION RULE: For tomato leaves with spots, FIRST check SIZE - if spots are LARGE (5-15mm), it is likely Target Spot (check for target-like rings). If spots are SMALL (1-3mm), it is likely Septoria. If you see LARGE spots (5-15mm) with TARGET-LIKE concentric rings (alternating dark/light bands creating a bull's-eye pattern), it is ALWAYS Target Spot, NOT Septoria. If you see SMALL circular spots (1-3mm) with tan-gray centers and pycnidia dots, it is Septoria, NOT Target Spot. Reference: Research published in Crop Protection (2019) and Extension services (University of Florida IFAS, North Carolina State Extension) clearly document that Target Spot is characterized by large lesions with distinct target-like concentric rings, while Septoria produces small circular spots with pycnidia.\n".
                          "   - Target Spot vs Leaf Mold: These are COMPLETELY DIFFERENT diseases. Target Spot (Corynespora cassiicola) produces LARGE spots with DISTINCT TARGET-LIKE concentric rings (alternating dark/light bands) on the UPPER leaf surface. The spots are visible from above and show a clear target pattern. Leaf Mold (Passalora fulva, formerly Cladosporium fulvum) produces YELLOW areas on the UPPER surface with FUZZY GRAY MOLD on the LOWER/UNDERSIDE of the leaf. The key distinction is LOCATION and PATTERN: target-like rings on upper surface = Target Spot; yellow upper with fuzzy gray mold underneath = Leaf Mold. CRITICAL: If you see target-like rings on the upper leaf surface, it is Target Spot, NOT Leaf Mold. If you see yellow upper surface with fuzzy gray mold underneath, it is Leaf Mold, NOT Target Spot. Reference: Compendium of Tomato Diseases distinguishes target-like patterns from leaf mold's characteristic underside growth.\n".
                          "   - Leaf Mold vs Early Blight: Leaf Mold (Passalora fulva) has YELLOW upper surface with FUZZY GRAY MOLD underneath (flip leaf to see the mold). Early Blight (Alternaria solani) has brown spots with concentric rings on upper surface, NO fuzzy mold underneath. The key distinction: fuzzy gray mold underneath = Leaf Mold; brown spots with rings, no mold underneath = Early Blight. CRITICAL: If you see fuzzy gray mold on the underside of leaves, it is Leaf Mold, NOT Early Blight. Reference: Research on tomato diseases emphasizes the underside mold growth as diagnostic for Leaf Mold.\n".
                          "   - Target Spot vs Spider Mites: These are COMPLETELY DIFFERENT issues - one is a DISEASE, the other is a PEST. Target Spot (Corynespora cassiicola) is a FUNGAL DISEASE that produces LARGE, DEFINED SPOTS (5-15mm in diameter) with DISTINCT TARGET-LIKE concentric rings (alternating dark/light bands creating a bull's-eye pattern) on tomato leaves. These are CLEAR, LARGE, CIRCULAR LESIONS with visible rings. Spider Mites (Tetranychus urticae) are PESTS that show STIPPLING (tiny yellow/white dots scattered across the leaf surface from feeding damage - these are NOT large defined spots), fine webbing between leaves/stems, and leaf curling. Spider Mites create a STIPPLING PATTERN (many tiny dots scattered across the leaf), NOT large defined circular lesions with rings. CRITICAL DECISION RULE: If you see LARGE, DEFINED SPOTS (5-15mm) with TARGET-LIKE RINGS (alternating dark/light bands), it is Target Spot (FUNGAL DISEASE), NOT Spider Mites (PEST). If you see TINY DOTS/STIPPLING scattered across the leaf (no large defined spots, no rings) with webbing, it is Spider Mites (PEST), NOT Target Spot. The key distinction: LARGE defined spots with rings = Target Spot (disease); tiny scattered dots/stippling = Spider Mites (pest). Reference: Extension services (UC IPM, Cornell) clearly distinguish fungal lesions (large defined spots) from pest stippling damage (tiny scattered dots).\n".
                          "   - Target Spot vs Powdery Mildew: Target Spot has LARGE spots with target-like rings; Powdery Mildew has WHITE POWDERY COATING on leaf surface, NO target-like spots. CRITICAL: If you see large spots with target-like rings, it is Target Spot, NOT Powdery Mildew. If you see white powdery coating, it is Powdery Mildew, NOT Target Spot.\n\n".
                          "   GRAPE DISEASES:\n".
                          "   - Black Rot vs Leaf Blight (Isariopsis Leaf Spot): Black Rot (Guignardia bidwellii) produces circular or round dark brown/black spots with pycnidia (tiny black dots in the center of lesions). Leaf Blight (Isariopsis griseola, also called Angular Leaf Spot) produces angular or irregular brown spots that follow leaf vein patterns, creating angular or rectangular shapes, and has no pycnidia. The key distinction: circular/round spots = Black Rot; angular/irregular spots following veins = Leaf Blight. Reference: Grape disease identification guides (UC IPM, Extension services) emphasize shape and pycnidia presence.\n".
                          "   - Esca (Black Measles) vs Anthracnose: Esca has BLACK SPOTS/STREAKS on grape leaves and stems (measles-like pattern); Anthracnose has SUNKEN, circular lesions with dark margins\n".
                          "   - Esca (Black Measles) vs Black Rot: These are COMPLETELY DIFFERENT diseases with distinct causal agents and symptoms. Esca (Black Measles, caused by Phaeomoniella chlamydospora and other fungi) produces BLACK SPOTS, STREAKS, or VEIN DISCOLORATION on grape leaves and stems, creating a measles-like pattern. The spots are irregular and often follow leaf veins, creating streaks or irregular black patches. Black Rot (Guignardia bidwellii) produces CIRCULAR or ROUND dark brown/black spots with pycnidia (tiny black dots in the center of lesions). The key distinction is PATTERN: irregular black spots/streaks/vein discoloration (measles-like) = Esca (Black Measles); circular/round spots with pycnidia = Black Rot. CRITICAL: If you see irregular black spots, streaks, or vein discoloration (measles-like pattern), it is Esca (Black Measles), NOT Black Rot. If you see circular/round spots with pycnidia, it is Black Rot, NOT Esca. Reference: Research on Esca complex (Phaeomoniella chlamydospora) published in Phytopathology and Plant Disease journals documents the irregular streak/vein discoloration pattern, while studies on Guignardia bidwellii (Black Rot) document circular lesions with pycnidia as key diagnostic features.\n".
                          "   - Esca (Black Measles) vs Leaf Blight (Isariopsis Leaf Spot): These are COMPLETELY DIFFERENT diseases. Esca (Black Measles) produces BLACK SPOTS, STREAKS, or VEIN DISCOLORATION creating a measles-like pattern with irregular black patches. Leaf Blight (Isariopsis griseola) produces ANGULAR or IRREGULAR brown spots that follow leaf vein patterns, creating angular/rectangular shapes, but the spots are BROWN, NOT black, and do NOT create a measles-like pattern. The key distinction is COLOR and PATTERN: black spots/streaks/vein discoloration (measles-like) = Esca; angular brown spots following veins (NOT black, NOT measles-like) = Leaf Blight. CRITICAL: If you see black spots, streaks, or vein discoloration (measles-like), it is Esca, NOT Leaf Blight. If you see angular brown spots following veins, it is Leaf Blight, NOT Esca. Reference: Research on Esca documents black measles-like patterns, while Leaf Blight research documents angular brown lesions.\n\n".
                          "   CORN DISEASES:\n".
                          "   - Cercospora Leaf Spot (Gray Leaf Spot) vs Northern Leaf Blight: These are COMPLETELY DIFFERENT diseases with distinct visual characteristics. Cercospora Leaf Spot (Cercospora zeae-maydis, also called Gray Leaf Spot) produces RECTANGULAR or SQUARE lesions that are bounded by leaf veins, creating angular/rectangular shapes. The lesions are GRAYISH-BROWN in color and have a distinct rectangular appearance. Northern Leaf Blight (Exserohilum turcicum) produces LONG, ELONGATED, CIGAR-SHAPED lesions that are NOT rectangular - they are long and narrow, often several centimeters in length, with a tan to brown color. The key distinction is SHAPE: rectangular/square lesions bounded by veins = Cercospora (Gray Leaf Spot); long elongated cigar-shaped lesions = Northern Leaf Blight. CRITICAL: If lesions are rectangular or square and bounded by veins, it is Cercospora (Gray Leaf Spot), NOT Northern Leaf Blight. If lesions are long and cigar-shaped, it is Northern Leaf Blight, NOT Cercospora. Reference: Research on Cercospora zeae-maydis published in Plant Disease and Phytopathology journals documents the rectangular, vein-bounded lesion morphology as a key diagnostic feature, distinguishing it from the elongated cigar-shaped lesions of Exserohilum turcicum.\n".
                          "   - Cercospora Leaf Spot (Gray Leaf Spot) vs Common Rust: These are COMPLETELY DIFFERENT diseases with different causal agents. Cercospora Leaf Spot (Gray Leaf Spot, Cercospora zeae-maydis) produces RECTANGULAR or SQUARE lesions that are bounded by leaf veins, creating angular/rectangular shapes. The lesions are GRAYISH-BROWN in color and have a distinct rectangular appearance. Common Rust (Puccinia sorghi) produces SMALL, CIRCULAR to OVAL PUSTULES (raised bumps) that are ORANGE to BROWN-RED in color, scattered on both leaf surfaces. The pustules are raised and powdery when mature. The key distinction is SHAPE and COLOR: rectangular/square grayish-brown lesions bounded by veins = Cercospora (Gray Leaf Spot); small circular/oval orange-brown pustules = Common Rust. CRITICAL: If lesions are rectangular or square and grayish-brown, it is Cercospora (Gray Leaf Spot), NOT Common Rust. If you see small circular/oval orange-brown pustules, it is Common Rust, NOT Cercospora. Reference: Studies on Cercospora zeae-maydis morphology published in Plant Disease journals document the rectangular lesion pattern, while research on Puccinia sorghi (Common Rust) documents circular/oval pustules as diagnostic features.\n\n".
                          "   PEST vs DISEASE:\n".
                          "   - Spider Mites vs Powdery Mildew: Spider Mites show STIPPLING (tiny yellow/white dots from feeding), fine webbing between leaves/stems, leaf curling. Powdery Mildew shows WHITE POWDERY COATING on leaf surface, NO stippling or webbing. Reference: Extension services distinguish mites by stippling/webbing vs fungal coating.\n".
                          "   - Spider Mites vs Bacterial Spot: These are COMPLETELY DIFFERENT issues. Spider Mites (pest) show STIPPLING (tiny yellow/white dots from feeding damage), fine webbing between leaves/stems, and overall leaf yellowing/curling. Bacterial Spot (disease) shows ANGULAR WATER-SOAKED lesions that are bounded by leaf veins, creating angular/rectangular shapes, with a greasy/oily appearance. CRITICAL: If you see angular/rectangular lesions bounded by veins, it is Bacterial Spot (disease), NOT Spider Mites (pest). If you see tiny dots/stippling and webbing, it is Spider Mites, NOT Bacterial Spot. Reference: Bacterial diseases create distinct angular lesions; mites create stippling patterns without defined lesion boundaries.\n".
                          "   - Spider Mites vs Early Blight: Spider Mites (pest) show STIPPLING (tiny yellow/white dots from feeding), fine webbing, and leaf curling - they do NOT produce fungal lesions. Early Blight (disease) shows LARGE brown spots with CONCENTRIC RINGS (fungal lesions). CRITICAL: If you see tiny dots/stippling and webbing, it is Spider Mites (pest), NOT Early Blight (disease). If you see large spots with concentric rings, it is Early Blight, NOT Spider Mites. Reference: Extension services distinguish pest stippling from fungal lesions.\n".
                          "   - Tomato Mosaic Virus vs Spider Mites: These are COMPLETELY DIFFERENT issues. Tomato Mosaic Virus (disease) shows MOSAIC PATTERNS (light/dark green mottling creating a patchwork or mosaic appearance), leaf distortion, and sometimes leaf curling. The mottling is a color pattern (light green and dark green patches), NOT tiny dots. Spider Mites (pest) show STIPPLING (tiny yellow/white dots from feeding damage scattered across the leaf), fine webbing between leaves/stems, and leaf curling. The key distinction: mosaic color pattern (light/dark green patches) = Tomato Mosaic Virus; tiny dots/stippling with webbing = Spider Mites. CRITICAL: If you see tiny dots/stippling and webbing, it is Spider Mites (pest), NOT Tomato Mosaic Virus (disease). If you see mosaic color patterns (light/dark green mottling), it is Tomato Mosaic Virus, NOT Spider Mites. Reference: Research on tomato diseases distinguishes viral mosaic patterns from pest stippling damage.\n\n".
                          "   CITRUS DISEASES:\n".
                          "   - Haunglongbing (Citrus Greening) vs Citrus Canker: These are completely different diseases. Haunglongbing (HLB, Candidatus Liberibacter) is a bacterial disease that causes ASYMMETRIC MOTTLING (one side of leaf yellow, other side green), leaf vein yellowing, misshapen/small fruit, and overall tree decline. Citrus Canker (Xanthomonas citri) is a bacterial disease that causes RAISED, CRUSTY, SCAB-LIKE lesions on leaves, fruit, and stems - these are physical raised bumps/sores, NOT mottling. Greening shows mottling and yellowing; Canker shows raised lesions/bumps. Reference: USDA APHIS and Florida Extension services provide detailed diagnostic guides for these diseases.\n".
                          "   - Haunglongbing (Citrus Greening) vs Iron Deficiency: Greening shows ASYMMETRIC MOTTLING (one side yellow, one side green), leaf vein yellowing, misshapen fruit; Iron Deficiency shows INTERVEINAL CHLOROSIS (yellow between veins), veins stay green, NO mottling pattern, NO fruit deformation\n\n".
                          "   PHYSIOLOGICAL vs DISEASE:\n".
                          "   - Leaf Scorch vs Leaf Spot: Leaf Scorch shows BROWNING AT LEAF MARGINS/EDGES (starts from edges inward), uniform pattern along leaf edges, often with crispy/dry appearance. Leaf Spot shows DISCRETE CIRCULAR/ANGULAR SPOTS scattered on leaf surface, NOT starting from margins. Reference: Physiological disorders (scorch) affect margins; diseases create discrete spots.\n".
                          "   - Leaf Scorch vs Bacterial Spot: These are COMPLETELY DIFFERENT issues. Leaf Scorch (physiological disorder) shows BROWNING AT LEAF MARGINS/EDGES that starts from the outer edges and moves inward, creating a uniform browning pattern along leaf edges, often with crispy/dry appearance. Bacterial Spot (disease) shows ANGULAR WATER-SOAKED lesions that are bounded by leaf veins, creating angular/rectangular shapes scattered across the leaf surface (NOT starting from margins), with a greasy/oily appearance. CRITICAL: If browning starts from leaf margins/edges and moves inward uniformly, it is Leaf Scorch (physiological), NOT Bacterial Spot (disease). If you see angular lesions scattered on the leaf (not starting from margins), it is Bacterial Spot. Reference: Physiological disorders affect margins uniformly; bacterial diseases create discrete angular lesions.\n\n".
                          "   HEALTHY vs DISEASE:\n".
                          "   - If leaves are uniformly green with NO spots, lesions, discoloration, or abnormalities, the plant is HEALTHY\n".
                          "   - Do NOT confuse natural leaf texture, minor blemishes, or normal aging with disease\n".
                          "   - Powdery Mildew requires visible WHITE POWDERY COATING on leaf surface - this is a distinct fungal growth that looks like flour or powder. Do NOT diagnose Powdery Mildew on healthy green leaves without visible white powdery coating. Natural leaf texture, light reflection, or minor surface variations are NOT Powdery Mildew. CRITICAL: Only diagnose Powdery Mildew if you can clearly see a white powdery/fungal coating on the leaf surface - if leaves are uniformly green with no visible white coating, the plant is HEALTHY, NOT Powdery Mildew.\n".
                          "   - Spider Mites (Two-Spotted Spider Mite, Tetranychus urticae) are COMMON tomato pests. Look for STIPPLING (tiny yellow/white dots scattered across the leaf surface from feeding damage), fine webbing between leaves/stems, leaf yellowing, and leaf curling. Spider Mites are PESTS, NOT diseases - they create stippling patterns, NOT fungal lesions or spots. CRITICAL: If you see tiny dots/stippling on tomato leaves (especially with webbing), it is likely Spider Mites. Do NOT confuse stippling (tiny dots) with mosaic patterns (light/dark green patches) or fungal spots. Reference: Extension services (UC IPM, Cornell) document stippling and webbing as key diagnostic features for spider mite damage.\n".
                          "   - For angular or rectangular lesions on tomato/pepper leaves, consider Bacterial Spot\n".
                          "   - CRITICAL DISTINCTION: Bacterial Spot has ANGULAR lesions bounded by veins - if you see angular/rectangular shapes, it is Bacterial Spot, NOT Spider Mites (stippling) or Leaf Scorch (margin browning)\n".
                          "   - IMPORTANT: Balance accuracy with detection. While you should be careful not to diagnose diseases on healthy plants, you should also actively look for and detect diseases when symptoms are present. If you see clear symptoms (spots, lesions, discoloration, powdery coating, stippling, webbing, etc.), diagnose the disease. Do NOT default to 'healthy' or 'None' when clear disease symptoms are visible. Only classify as HEALTHY if the plant appears uniformly healthy with no visible symptoms. If symptoms are present but subtle, diagnose with lower confidence rather than saying 'None'.\n\n".
                          "4. Assess severity based on:\n".
                          "   - Percentage of affected tissue (mild: <25%, moderate: 25-50%, severe: >50%)\n".
                          "   - Impact on plant function (mild: cosmetic, moderate: growth affected, severe: life-threatening)\n".
                          "   - Spread potential (mild: localized, severe: systemic)\n\n".
                          "5. Provide specific, actionable recommendations:\n".
                          "   - Cultural practices (watering, pruning, spacing)\n".
                          "   - Organic treatments (neem oil, baking soda, copper fungicides)\n".
                          "   - Chemical treatments (if severe, specify active ingredients)\n".
                          "   - Prevention strategies\n".
                          "   - When to consult a professional\n\n".
                          "IMPORTANT: Respond with ONLY a valid JSON object, no additional text.\n\n".
                          "JSON STRUCTURE:\n".
                          "{\n".
                          "  \"hasDisease\": true or false (true if any health issue detected),\n".
                          "  \"diseaseName\": \"Specific disease/pest name (e.g., 'Powdery Mildew', 'Aphid Infestation', 'Iron Deficiency') or null if healthy\",\n".
                          "  \"severity\": \"mild\" or \"moderate\" or \"severe\" or null (based on affected area and impact),\n".
                          "  \"confidence\": 0.0 to 1.0 (your confidence in the diagnosis - be conservative),\n".
                          "  \"symptoms\": [\"Detailed list of visible symptoms (e.g., 'Yellow spots with brown centers', 'White powdery coating on upper leaves')\"],\n".
                          "  \"affectedAreas\": [\"Specific parts affected (e.g., 'upper leaves', 'stem base', 'entire plant')\"],\n".
                          "  \"recommendations\": [\"Actionable treatment steps in order of priority\"],\n".
                          "  \"notes\": \"Additional observations, differential diagnosis considerations, or environmental factors to consider\",\n".
                          "  \"detectedRegions\": \"Specific description of where symptoms appear in the image (e.g., 'Yellow spots concentrated on lower leaves, starting from leaf margins')\"\n".
                          "}\n\n".
                          "CRITICAL RULES:\n".
                          "- If the plant appears completely healthy with no visible issues, set hasDisease to false\n".
                          "- Be conservative with healthy plants - natural leaf texture, minor blemishes, or normal aging are not diseases\n".
                          "- Be specific with disease names (use exact names like 'Early Blight', 'Target Spot', 'Cedar Apple Rust' - not generic terms)\n".
                          "- Consider plant-specific diseases - if plant is Apple, consider both Apple Scab and Cedar Apple Rust. Cedar Apple Rust has orange/yellow/red spots; Apple Scab has dark olive-green to black spots. If you see orange or yellow coloration, it is Cedar Apple Rust\n".
                          "- Only diagnose what you can clearly see - if uncertain, lower confidence and note it\n".
                          "- For angular or rectangular lesions on tomato/pepper leaves, consider Bacterial Spot - these are NOT circular spots\n".
                          "- For small circular spots (1-3mm) on tomato leaves, consider Septoria - these are NOT angular\n".
                          "- Distinguish between diseases, pests, and environmental stress:\n".
                          "  * Diseases: Fungal spots, bacterial lesions, viral patterns\n".
                          "  * Pests: Stippling, webbing, holes, chewed edges\n".
                          "  * Deficiencies: Interveinal chlorosis, uniform yellowing\n".
                          "  * Viruses: Mosaic patterns, leaf distortion, stunting\n".
                          "- Pay attention to subtle symptoms - early-stage diseases may show only slight discoloration\n".
                          "- Use differential diagnosis to distinguish between similar-looking diseases - refer to the detailed comparisons above\n".
                          "- IMPORTANT: Actively detect diseases when symptoms are present. Do NOT default to 'None' or 'healthy' when clear disease symptoms are visible. If you see spots, lesions, discoloration, powdery coating, stippling, webbing, or other symptoms, diagnose the disease. Only classify as HEALTHY if the plant appears uniformly healthy with no visible symptoms. For subtle symptoms, diagnose with lower confidence rather than missing the disease entirely. Powdery Mildew requires visible WHITE POWDERY COATING - do NOT confuse natural leaf texture with Powdery Mildew, but DO diagnose it when the coating is clearly visible.\n".
                          "- For Apple diseases: Cedar Apple Rust has orange/yellow/red spots; Apple Scab has dark spots. Orange or yellow coloration indicates Cedar Apple Rust\n".
                          "- For Tomato diseases: Target Spot (Corynespora cassiicola) is a COMMON tomato disease. DECISION TREE: (1) If you see LARGE spots (5-15mm) on tomato leaves, FIRST consider Target Spot - check for TARGET-LIKE concentric rings (alternating dark/light bands creating a bull's-eye pattern). If rings are clearly visible and target-like, it is Target Spot. (2) If spots are LARGE but rings are less defined (not clearly target-like), consider Early Blight. (3) If spots are SMALL (1-3mm) with pycnidia, it is Septoria (NOT Target Spot). (4) If lesions are angular/rectangular, it is Bacterial Spot (NOT Target Spot). (5) If you see tiny dots/stippling scattered (no large defined spots), it is Spider Mites (NOT Target Spot). CRITICAL: For large spots on tomato leaves, Target Spot should be considered FIRST - look for the target-like rings (alternating bands). If rings are present and clearly visible, it is Target Spot.\n".
                          "- For Grape diseases: Black Rot has circular spots with pycnidia; Leaf Blight has angular spots following veins\n".
                          "- For Corn diseases: Cercospora has rectangular lesions; Northern Leaf Blight has elongated cigar-shaped lesions\n".
                          "- Provide practical, implementable recommendations\n".
                          "- Return ONLY the JSON object, no markdown, no code blocks, no explanations";
            
            $messages = [
                [
                    'role' => 'system',
                    'content' => $systemPrompt,
                ],
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => $userPrompt,
                        ],
                        [
                            'type' => 'image_url',
                            'image_url' => [
                                'url' => "data:{$mimeType};base64,{$base64Image}",
                            ],
                        ],
                    ],
                ],
            ];
            
            // Retry logic for API calls (increased retries and delays for better reliability)
            $maxRetries = 5; // Increased from 3 to 5
            $baseRetryDelay = 3; // Increased from 2 to 3 seconds
            $response = null;
            
            for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
                try {
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer '.$this->apiKey,
                        'Content-Type' => 'application/json',
                    ])->timeout(120)->post('https://api.openai.com/v1/chat/completions', [ // Increased timeout from 90 to 120
                        'model' => 'gpt-4o', // Using GPT-4o for vision capabilities
                        'messages' => $messages,
                        'temperature' => 0.3, // Lower temperature for more consistent diagnosis
                        'max_tokens' => 1000,
                    ]);
                    
                    if ($response->successful()) {
                        break; // Success, exit retry loop
                    }
                    
                    // If rate limited or server error, retry
                    if ($response->status() === 429 || ($response->status() >= 500 && $response->status() < 600)) {
                        if ($attempt < $maxRetries) {
                            $delay = $baseRetryDelay * pow(2, $attempt - 1); // Exponential backoff: 3s, 6s, 12s, 24s, 48s
                            Log::warning('OpenAI API retry', [
                                'attempt' => $attempt,
                                'status' => $response->status(),
                                'delay' => $delay,
                            ]);
                            sleep($delay);
                            continue;
                        }
                    } else {
                        // Non-retryable error, break immediately
                        break;
                    }
                } catch (\Exception $e) {
                    if ($attempt < $maxRetries) {
                        $delay = $baseRetryDelay * pow(2, $attempt - 1); // Exponential backoff
                        Log::warning('OpenAI API exception, retrying', [
                            'attempt' => $attempt,
                            'error' => $e->getMessage(),
                            'delay' => $delay,
                        ]);
                        sleep($delay);
                        continue;
                    }
                    throw $e; // Re-throw on final attempt
                }
            }
            
            if ($response && $response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? null;
                
                if ($content) {
                    // Clean content - remove markdown code blocks if present
                    $cleanedContent = preg_replace('/```(?:json)?\s*/', '', $content);
                    $cleanedContent = preg_replace('/```\s*$/', '', $cleanedContent);
                    $cleanedContent = trim($cleanedContent);
                    
                    // Try to parse as JSON directly first
                    $diagnosis = json_decode($cleanedContent, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($diagnosis)) {
                        $normalized = $this->normalizeDiagnosis($diagnosis);
                        $normalized['prompt_version'] = 'v2.6'; // Track prompt version (enhanced Target Spot detection with stronger prioritization)
                        return $normalized;
                    }
                    
                    // Try to extract JSON object from content
                    if (preg_match('/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/s', $cleanedContent, $jsonMatch)) {
                        $diagnosis = json_decode($jsonMatch[0], true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($diagnosis)) {
                            $normalized = $this->normalizeDiagnosis($diagnosis);
                            $normalized['prompt_version'] = 'v2.6'; // Track prompt version (enhanced Target Spot detection with stronger prioritization)
                            return $normalized;
                        }
                    }
                    
                    // Fallback: parse the response manually if JSON extraction fails
                    Log::warning('OpenAI Disease Detection - Could not parse JSON, using fallback parsing', [
                        'content' => $content,
                    ]);
                    
                    // Return a structured response even if JSON parsing fails
                    return [
                        'hasDisease' => stripos($content, 'healthy') === false && 
                                       (stripos($content, 'disease') !== false || 
                                        stripos($content, 'symptom') !== false),
                        'diseaseName' => null,
                        'severity' => null,
                        'confidence' => 0.5,
                        'symptoms' => [],
                        'affectedAreas' => [],
                        'recommendations' => [],
                        'notes' => $content,
                        'detectedRegions' => null,
                        'prompt_version' => 'v2.6', // Track prompt version (enhanced Target Spot detection with stronger prioritization)
                    ];
                }
            }
            
            // If we have a response, log it
            if ($response) {
                Log::error('OpenAI Disease Detection API Error', [
                    'response' => $response->body(),
                    'status' => $response->status(),
                ]);
            } else {
                Log::error('OpenAI Disease Detection API Error - No response after retries');
            }
            
            // Return a fallback response instead of null to prevent 500 errors
            return [
                'hasDisease' => false,
                'diseaseName' => null,
                'severity' => null,
                'confidence' => 0.0,
                'symptoms' => [],
                'affectedAreas' => [],
                'recommendations' => ['Please try again. The analysis service is temporarily unavailable.'],
                'notes' => 'API request failed after retries. Please retry the analysis.',
                'detectedRegions' => null,
                'prompt_version' => 'v2.6',
            ];
        } catch (\Exception $e) {
            Log::error('OpenAI Disease Detection Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'file' => $imagePath ?? 'unknown',
            ]);
            
            // Return a fallback response instead of null to prevent 500 errors
            // This allows the API to return a structured error response instead of crashing
            return [
                'hasDisease' => false,
                'diseaseName' => null,
                'severity' => null,
                'confidence' => 0.0,
                'symptoms' => [],
                'affectedAreas' => [],
                'recommendations' => ['Please try again. An error occurred during analysis.'],
                'notes' => 'Analysis failed: ' . (config('app.debug') ? $e->getMessage() : 'Internal error'),
                'detectedRegions' => null,
                'prompt_version' => 'v2.6',
            ];
        }
    }

    /**
     * Normalize diagnosis data to ensure all required fields are present
     */
    protected function normalizeDiagnosis(array $diagnosis): array
    {
        return [
            'hasDisease' => $diagnosis['hasDisease'] ?? false,
            'diseaseName' => $diagnosis['diseaseName'] ?? null,
            'severity' => $diagnosis['severity'] ?? null,
            'confidence' => (float) ($diagnosis['confidence'] ?? 0.5),
            'symptoms' => (array) ($diagnosis['symptoms'] ?? []),
            'affectedAreas' => (array) ($diagnosis['affectedAreas'] ?? []),
            'recommendations' => (array) ($diagnosis['recommendations'] ?? []),
            'notes' => $diagnosis['notes'] ?? null,
            'detectedRegions' => $diagnosis['detectedRegions'] ?? null,
        ];
    }

    /**
     * Get AI-powered spray timing recommendations based on plant data, weather, and spray history
     *
     * @param  array  $plantData  Plant information
     * @param  array  $farmData  Farm information
     * @param  array  $weatherData  Current and forecast weather
     * @param  array  $sprayHistory  Previous spray applications
     * @param  array  $currentSpray  Current spray to be applied (optional)
     * @return array|null Returns spray recommendations or null on error
     */
    public function getSprayRecommendation($plantData, $farmData, $weatherData, $sprayHistory = [], $currentSpray = null)
    {
        try {
            $prompt = $this->buildSprayPrompt($plantData, $farmData, $weatherData, $sprayHistory, $currentSpray);

            $systemPrompt = $this->buildSpraySystemPrompt();

            $seedData = json_encode([
                'plant' => $plantData['name'] ?? '',
                'farm' => $farmData['name'] ?? '',
                'spray' => $currentSpray['spray_name'] ?? '',
                'date' => now()->format('Y-m-d'),
            ]);
            $seed = crc32($seedData);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemPrompt,
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.1,
                'max_tokens' => 1500,
                'seed' => $seed,
                'top_p' => 0.95,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? null;

                if ($content) {
                    $cleanedContent = preg_replace('/```(?:json)?\s*/', '', $content);
                    $cleanedContent = preg_replace('/```\s*$/', '', $cleanedContent);
                    $cleanedContent = trim($cleanedContent);

                    if (preg_match('/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/s', $cleanedContent, $jsonMatch)) {
                        $recommendation = json_decode($jsonMatch[0], true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($recommendation)) {
                            return $this->normalizeSprayRecommendation($recommendation);
                        }
                    }

                    return [
                        'recommendation' => $content,
                        'optimalDates' => [],
                        'avoidDates' => [],
                        'weatherConsiderations' => null,
                        'sprayTiming' => null,
                        'intervalRecommendation' => null,
                        'seasonalAdvice' => null,
                        'urgencyLevel' => 'medium',
                    ];
                }
            }

            Log::error('OpenAI Spray Recommendation API Error', [
                'response' => $response->body(),
                'status' => $response->status(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('OpenAI Spray Recommendation Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return null;
        }
    }

    /**
     * Build system prompt with spray database knowledge
     * This enriches the AI with actual spray data from the database
     */
    protected function buildSpraySystemPrompt(): string
    {
        $basePrompt = 'You are a PRECISE and SCIENTIFIC agricultural consultant specializing in integrated pest management (IPM), '.
                     'crop protection, and precision agriculture. '."\n\n".
                     'CRITICAL INSTRUCTION: You must provide CONSISTENT, EVIDENCE-BASED recommendations. '."\n".
                     'Do NOT vary your answers - given the same inputs, always provide the same recommendation. '."\n".
                     'Base ALL decisions on established agricultural science and the specific data provided.'."\n\n".
                     'Your expertise includes:'."\n".
                     '- Plant-specific pest and disease patterns (use scientific thresholds)'."\n".
                     '- Chemical application timing based on documented efficacy windows'."\n".
                     '- Weather impacts: Rain within 6 hours = avoid, Wind >15 km/h = avoid, Temp 15-25°C = optimal'."\n".
                     '- Standard spray intervals: Fungicides 7-14 days, Insecticides 10-21 days, Herbicides as needed'."\n".
                     '- Pre-harvest intervals (PHI): Always respect labeled PHI periods'."\n".
                     '- Seasonal pressures: Spring = fungal diseases, Summer = insects, Fall = late blight'."\n".
                     '- Application timing: Early morning (6-9 AM) or late evening (6-8 PM) when wind is calm'."\n\n".
                     'DECISION RULES (apply consistently):'."\n".
                     '- If rain expected within 24 hours: DO NOT recommend spraying'."\n".
                     '- If wind speed > 15 km/h: DO NOT recommend spraying'."\n".
                     '- If temperature > 30°C: Recommend early morning only'."\n".
                     '- If temperature < 10°C: Consider delayed application'."\n".
                     '- If humidity > 90%: Risk of poor drying, caution advised'."\n".
                     '- If last spray < 7 days ago with same chemical: DO NOT recommend (resistance risk)'."\n\n".
                     'Your recommendations must be DETERMINISTIC - same conditions = same advice.'."\n\n";

        try {
            $sprays = \App\Models\Spray::with(['plant', 'farm'])->get();

            if ($sprays->isNotEmpty()) {
                $basePrompt .= "=== SPRAY DATABASE KNOWLEDGE ===\n";
                $basePrompt .= "You have access to the following spray records from the farm database. Use this information to provide more accurate recommendations:\n\n";

                $spraysByPlant = $sprays->groupBy(function ($spray) {
                    return $spray->plant->name ?? 'Unknown Plant';
                });

                foreach ($spraysByPlant as $plantName => $plantSprays) {
                    $basePrompt .= "PLANT: {$plantName}\n";
                    $basePrompt .= str_repeat('-', 40)."\n";

                    foreach ($plantSprays as $spray) {
                        $basePrompt .= "  Spray: {$spray->spray_name}\n";
                        $basePrompt .= "    - Chemical: {$spray->chemical_name}\n";
                        $basePrompt .= "    - Purpose: {$spray->purpose}\n";

                        if ($spray->plant_pest) {
                            $basePrompt .= "    - Target Pest/Disease: {$spray->plant_pest}\n";
                        }

                        $basePrompt .= "    - Dosage: {$spray->dosage}\n";

                        if ($spray->frequency) {
                            $basePrompt .= "    - Recommended Frequency: {$spray->frequency}\n";
                        }

                        if ($spray->season) {
                            $basePrompt .= "    - Recommended Season: {$spray->season}\n";
                        }

                        if ($spray->application_date) {
                            $basePrompt .= "    - Last Applied: {$spray->application_date}\n";
                        }

                        if ($spray->notes) {
                            $basePrompt .= "    - Notes: {$spray->notes}\n";
                        }

                        $basePrompt .= "\n";
                    }
                }

                $totalSprays = $sprays->count();
                $uniqueChemicals = $sprays->pluck('chemical_name')->unique()->count();
                $uniquePlants = $spraysByPlant->count();

                $basePrompt .= "=== DATABASE SUMMARY ===\n";
                $basePrompt .= "Total spray records: {$totalSprays}\n";
                $basePrompt .= "Unique chemicals: {$uniqueChemicals}\n";
                $basePrompt .= "Plants covered: {$uniquePlants}\n\n";

                $purposes = $sprays->pluck('purpose')->unique()->filter()->values();
                if ($purposes->isNotEmpty()) {
                    $basePrompt .= 'Common spray purposes in database: '.$purposes->implode(', ')."\n";
                }

                $seasons = $sprays->pluck('season')->unique()->filter()->values();
                if ($seasons->isNotEmpty()) {
                    $basePrompt .= 'Seasons with spray activity: '.$seasons->implode(', ')."\n";
                }

                $basePrompt .= "\nUSE THIS DATABASE KNOWLEDGE to:\n";
                $basePrompt .= "- Reference specific sprays that have been used before on this plant\n";
                $basePrompt .= "- Consider spray rotation to prevent resistance\n";
                $basePrompt .= "- Recommend intervals based on previous application dates\n";
                $basePrompt .= "- Suggest alternative sprays from the database if conditions aren't suitable\n";
                $basePrompt .= "- Provide dosage and frequency guidance based on historical data\n\n";
            }
        } catch (\Exception $e) {
            Log::warning('Could not fetch spray database for system prompt', [
                'error' => $e->getMessage(),
            ]);
        }

        return $basePrompt;
    }

    /**
     * Build comprehensive prompt for spray timing recommendations
     */
    protected function buildSprayPrompt($plantData, $farmData, $weatherData, $sprayHistory, $currentSpray)
    {
        $currentDate = now()->format('Y-m-d');
        $currentSeason = $this->getCurrentSeason();

        $prompt = "You are providing spray timing recommendations for optimal crop protection and management.\n\n";

        $prompt .= "PLANT INFORMATION:\n";
        $prompt .= '- Plant Name: '.($plantData['name'] ?? 'Unknown')."\n";
        $prompt .= '- Plant Details: '.($plantData['info'] ?? 'No details available')."\n";
        $prompt .= '- Growth Stage: ';

        if (isset($farmData['created_at'])) {
            $plantingDate = \Carbon\Carbon::parse($farmData['created_at']);
            $daysSincePlanting = $plantingDate->diffInDays(now());
            $prompt .= "Approximately {$daysSincePlanting} days since planting\n";
        } else {
            $prompt .= "Unknown\n";
        }

        $prompt .= "\n";

        $prompt .= "FARM INFORMATION:\n";
        $prompt .= '- Farm Name: '.($farmData['name'] ?? 'Unknown Farm')."\n";

        $latitude = $farmData['latitude'] ?? 'Unknown';
        $longitude = $farmData['longitute'] ?? $farmData['longitude'] ?? 'Unknown';
        $prompt .= "- Location: Latitude {$latitude}, Longitude {$longitude}\n";
        $prompt .= "- Current Date: {$currentDate}\n";
        $prompt .= "- Current Season: {$currentSeason}\n\n";

        $prompt .= "CURRENT WEATHER CONDITIONS:\n";
        if (! empty($weatherData['current'])) {
            $current = $weatherData['current'];
            $prompt .= '- Temperature: '.($current['temperature'] ?? 'N/A')."°C\n";
            $prompt .= '- Humidity: '.($current['humidity'] ?? 'N/A')."%\n";
            $prompt .= '- Wind Speed: '.($current['wind_speed'] ?? 'N/A')." m/s\n";
            $prompt .= '- Air Pressure: '.($current['air_pressure'] ?? 'N/A')." hPa\n";
            $prompt .= '- Conditions Status: '.($current['status'] ?? 'Unknown')."\n";
        } else {
            $prompt .= "- Weather data not available\n";
        }
        $prompt .= "\n";

        if (! empty($weatherData['forecast'])) {
            $prompt .= "7-DAY WEATHER FORECAST:\n";
            $prompt .= $this->summarizeWeatherForecast($weatherData['forecast']);
            $prompt .= "\n";
        }

        if (! empty($sprayHistory)) {
            $prompt .= "SPRAY APPLICATION HISTORY:\n";
            foreach ($sprayHistory as $index => $spray) {
                $daysSinceSpray = \Carbon\Carbon::parse($spray['application_date'])->diffInDays(now());
                $prompt .= 'Application '.($index + 1).":\n";
                $prompt .= "  - Spray Name: {$spray['spray_name']}\n";
                $prompt .= "  - Chemical: {$spray['chemical_name']}\n";
                $prompt .= "  - Purpose: {$spray['purpose']}\n";
                if (! empty($spray['plant_pest'])) {
                    $prompt .= "  - Target Pest/Disease: {$spray['plant_pest']}\n";
                }
                $prompt .= "  - Dosage: {$spray['dosage']}\n";
                if (! empty($spray['frequency'])) {
                    $prompt .= "  - Recommended Frequency: {$spray['frequency']}\n";
                }
                $prompt .= "  - Last Application: {$spray['application_date']} ({$daysSinceSpray} days ago)\n";
                $prompt .= "  - Season: {$spray['season']}\n";
                if (! empty($spray['notes'])) {
                    $prompt .= "  - Notes: {$spray['notes']}\n";
                }
                $prompt .= "\n";
            }
        } else {
            $prompt .= "SPRAY APPLICATION HISTORY: No previous spray applications recorded\n\n";
        }

        if (! empty($currentSpray)) {
            $prompt .= "SPRAY TO BE APPLIED:\n";
            $prompt .= "- Spray Name: {$currentSpray['spray_name']}\n";
            $prompt .= "- Chemical: {$currentSpray['chemical_name']}\n";
            $prompt .= "- Purpose: {$currentSpray['purpose']}\n";
            if (! empty($currentSpray['plant_pest'])) {
                $prompt .= "- Target Pest/Disease: {$currentSpray['plant_pest']}\n";
            }
            $prompt .= "- Dosage: {$currentSpray['dosage']}\n";
            if (! empty($currentSpray['frequency'])) {
                $prompt .= "- Recommended Frequency: {$currentSpray['frequency']}\n";
            }
            $prompt .= "\n";
        }

        $prompt .= "ANALYSIS INSTRUCTIONS:\n";
        $prompt .= "Provide a comprehensive spray timing recommendation considering:\n\n";

        $prompt .= "1. WEATHER IMPACT ANALYSIS:\n";
        $prompt .= "   - Rain: Will rain wash away the spray? Check forecast for rain within 24-48 hours\n";
        $prompt .= "   - Temperature: Is it too hot (>30°C) or too cold (<10°C) for effective application?\n";
        $prompt .= "   - Wind: Is wind speed suitable? (<10 km/h ideal, >15 km/h problematic)\n";
        $prompt .= "   - Humidity: Optimal humidity for spray effectiveness (40-70% ideal)\n";
        $prompt .= "   - Dew: Morning dew impact on absorption\n\n";

        $prompt .= "2. SPRAY INTERVAL & TIMING:\n";
        $prompt .= "   - Time since last spray of same/similar chemical\n";
        $prompt .= "   - Recommended spray intervals for the chemical/purpose\n";
        $prompt .= "   - Risk of resistance if sprayed too frequently\n";
        $prompt .= "   - Optimal time of day for application (early morning/late evening usually best)\n\n";

        $prompt .= "3. PLANT GROWTH STAGE:\n";
        $prompt .= "   - Current growth stage suitability for spraying\n";
        $prompt .= "   - Flowering stage considerations (pollinator safety)\n";
        $prompt .= "   - Pre-harvest interval requirements\n";
        $prompt .= "   - Plant stress levels and recovery time\n\n";

        $prompt .= "4. SEASONAL FACTORS:\n";
        $prompt .= "   - Current season pest/disease pressure for this plant\n";
        $prompt .= "   - Preventive vs. curative timing\n";
        $prompt .= "   - Seasonal weather patterns typical for this location\n\n";

        $prompt .= "5. URGENCY ASSESSMENT:\n";
        $prompt .= "   - HIGH: Disease/pest outbreak, immediate action needed\n";
        $prompt .= "   - MEDIUM: Preventive or scheduled maintenance spray\n";
        $prompt .= "   - LOW: Optional, can wait for better conditions\n\n";

        $prompt .= "PROVIDE YOUR RECOMMENDATION IN THIS JSON FORMAT:\n";
        $prompt .= "{\n";
        $prompt .= "  \"recommendation\": \"Detailed paragraph summary of your recommendation\",\n";
        $prompt .= "  \"optimalDates\": [\n";
        $prompt .= "    {\n";
        $prompt .= "      \"date\": \"YYYY-MM-DD\",\n";
        $prompt .= "      \"timeOfDay\": \"Early morning (6-8 AM)\" or \"Late evening (6-8 PM)\" or \"Mid-morning (8-10 AM)\",\n";
        $prompt .= "      \"reason\": \"Why this date/time is optimal\",\n";
        $prompt .= "      \"weatherSummary\": \"Expected weather conditions\"\n";
        $prompt .= "    }\n";
        $prompt .= "  ],\n";
        $prompt .= "  \"avoidDates\": [\n";
        $prompt .= "    {\n";
        $prompt .= "      \"date\": \"YYYY-MM-DD\",\n";
        $prompt .= "      \"reason\": \"Why to avoid (rain expected, too hot, too windy, etc.)\"\n";
        $prompt .= "    }\n";
        $prompt .= "  ],\n";
        $prompt .= "  \"weatherConsiderations\": \"Key weather factors affecting spray effectiveness\",\n";
        $prompt .= "  \"sprayTiming\": \"Best time of day and why\",\n";
        $prompt .= "  \"intervalRecommendation\": \"Guidance on spray intervals and next application\",\n";
        $prompt .= "  \"seasonalAdvice\": \"Season-specific considerations for this plant and spray\",\n";
        $prompt .= "  \"urgencyLevel\": \"high\" or \"medium\" or \"low\",\n";
        $prompt .= "  \"safetyNotes\": \"Important safety considerations (PPE, re-entry period, pollinator safety, etc.)\",\n";
        $prompt .= "  \"resistanceManagement\": \"Tips to prevent pest/pathogen resistance\",\n";
        $prompt .= "  \"alternativeActions\": \"Alternative approaches if conditions are not suitable\"\n";
        $prompt .= "}\n\n";

        $prompt .= "CRITICAL REQUIREMENTS FOR CONSISTENT RECOMMENDATIONS:\n";
        $prompt .= "1. Apply the DECISION RULES strictly - no exceptions\n";
        $prompt .= "2. Use EXACT thresholds: Wind >15 km/h = avoid, Rain within 24h = avoid, Temp 15-25°C = optimal\n";
        $prompt .= "3. Recommend the EARLIEST suitable date from the forecast that meets all criteria\n";
        $prompt .= "4. If multiple dates are equally suitable, prefer the closest date\n";
        $prompt .= "5. Time of day: Default to Early morning (6-8 AM) unless temperature >28°C, then Late evening\n";
        $prompt .= "6. Be DETERMINISTIC - given identical inputs, always provide identical outputs\n";
        $prompt .= "7. Base urgency ONLY on: pest presence = HIGH, preventive schedule = MEDIUM, optional = LOW\n";
        $prompt .= "8. Return ONLY valid JSON, no additional text, explanations, or markdown\n";
        $prompt .= "9. Use ONLY dates from the provided weather forecast data\n";
        $prompt .= "10. If NO suitable date exists in forecast, clearly state this in recommendation\n";

        return $prompt;
    }

    /**
     * Summarize weather forecast for spray recommendation
     */
    protected function summarizeWeatherForecast($forecast)
    {
        $summary = '';

        foreach ($forecast as $item) {
            $date = date('Y-m-d', strtotime($item['date']));
            $summary .= "Day {$date}:\n";
            $summary .= "  - Temperature: {$item['temperature']}°C\n";
            $summary .= "  - Humidity: {$item['humidity']}%\n";
            $summary .= "  - Wind Speed: {$item['wind_speed']} m/s\n";
            $summary .= "  - Air Pressure: {$item['air_pressure']} hPa\n";
            $summary .= "  - Status: {$item['status']}\n\n";
        }

        return $summary;
    }

    /**
     * Get current season based on date and hemisphere
     */
    protected function getCurrentSeason()
    {
        $month = now()->month;

        if ($month >= 3 && $month <= 5) {
            return 'Spring';
        } elseif ($month >= 6 && $month <= 8) {
            return 'Summer';
        } elseif ($month >= 9 && $month <= 11) {
            return 'Fall/Autumn';
        } else {
            return 'Winter';
        }
    }

    /**
     * Normalize spray recommendation data
     */
    protected function normalizeSprayRecommendation(array $recommendation): array
    {
        return [
            'recommendation' => $recommendation['recommendation'] ?? '',
            'optimalDates' => (array) ($recommendation['optimalDates'] ?? []),
            'avoidDates' => (array) ($recommendation['avoidDates'] ?? []),
            'weatherConsiderations' => $recommendation['weatherConsiderations'] ?? null,
            'sprayTiming' => $recommendation['sprayTiming'] ?? null,
            'intervalRecommendation' => $recommendation['intervalRecommendation'] ?? null,
            'seasonalAdvice' => $recommendation['seasonalAdvice'] ?? null,
            'urgencyLevel' => $recommendation['urgencyLevel'] ?? 'medium',
            'safetyNotes' => $recommendation['safetyNotes'] ?? null,
            'resistanceManagement' => $recommendation['resistanceManagement'] ?? null,
            'alternativeActions' => $recommendation['alternativeActions'] ?? null,
        ];
    }
}
