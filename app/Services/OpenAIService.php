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
            
            // Build the prompt for disease detection
            $systemPrompt = 'You are an expert plant pathologist with decades of experience in agricultural diagnostics. '.
                           'You specialize in identifying plant diseases, pest damage, nutrient deficiencies, and physiological disorders. '.
                           'You have extensive knowledge of common plant pathogens (fungal, bacterial, viral), pest damage patterns, '.
                           'and can distinguish between diseases and environmental stress. You provide accurate, actionable diagnoses.';
            
            $userPrompt = "Perform a comprehensive visual analysis of this plant image to identify any health issues.\n\n";
            
            if ($plantName) {
                $userPrompt .= "PLANT SPECIES: {$plantName}\n\n";
            }
            
            $userPrompt .= "ANALYSIS INSTRUCTIONS:\n".
                          "1. Examine the entire image systematically:\n".
                          "   - Look for discoloration (yellowing, browning, blackening, chlorosis)\n".
                          "   - Check for spots, lesions, or necrotic areas\n".
                          "   - Identify patterns (circular spots, irregular patches, vein patterns)\n".
                          "   - Look for wilting, curling, or deformation\n".
                          "   - Check for powdery or fuzzy growth (fungal signs)\n".
                          "   - Look for holes, chewed edges, or pest damage\n".
                          "   - Assess overall plant vigor and growth patterns\n\n".
                          "2. Consider common plant health issues:\n".
                          "   - Fungal diseases (powdery mildew, leaf spot, rust, blight)\n".
                          "   - Bacterial diseases (bacterial spot, canker, wilt)\n".
                          "   - Viral diseases (mosaic patterns, stunting)\n".
                          "   - Pest damage (aphids, mites, caterpillars, beetles)\n".
                          "   - Nutrient deficiencies (yellowing, interveinal chlorosis)\n".
                          "   - Environmental stress (sunburn, water stress, frost damage)\n".
                          "   - Physiological disorders (edema, tip burn)\n\n".
                          "3. Assess severity based on:\n".
                          "   - Percentage of affected tissue (mild: <25%, moderate: 25-50%, severe: >50%)\n".
                          "   - Impact on plant function (mild: cosmetic, moderate: growth affected, severe: life-threatening)\n".
                          "   - Spread potential (mild: localized, severe: systemic)\n\n".
                          "4. Provide specific, actionable recommendations:\n".
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
                          "- Be specific with disease names (use scientific/common names like 'Early Blight' not just 'disease')\n".
                          "- Only diagnose what you can clearly see - if uncertain, lower confidence and note it\n".
                          "- Distinguish between diseases, pests, and environmental stress\n".
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
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer '.$this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o', // Using GPT-4o for vision capabilities
                'messages' => $messages,
                'temperature' => 0.3, // Lower temperature for more consistent diagnosis
                'max_tokens' => 1000,
            ]);
            
            if ($response->successful()) {
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
                        return $this->normalizeDiagnosis($diagnosis);
                    }
                    
                    // Try to extract JSON object from content
                    if (preg_match('/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/s', $cleanedContent, $jsonMatch)) {
                        $diagnosis = json_decode($jsonMatch[0], true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($diagnosis)) {
                            return $this->normalizeDiagnosis($diagnosis);
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
                    ];
                }
            }
            
            Log::error('OpenAI Disease Detection API Error', [
                'response' => $response->body(),
                'status' => $response->status(),
            ]);
            
            return null;
        } catch (\Exception $e) {
            Log::error('OpenAI Disease Detection Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return null;
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
}
