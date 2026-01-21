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
     * @param  string  $imagePath  Path to the uploaded image file
     * @param  string|null  $plantName  Optional plant name for better context
     * @return array|null Returns diagnosis data or null on error
     */
        public function analyzePlantDisease($imagePath, $plantName = null)
        {
            try {
                // Validate image file exists
                if (! file_exists($imagePath) || ! is_readable($imagePath)) {
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
                            '- Return ONLY the JSON object, no markdown, no code blocks, no explanations';

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

            // Build system prompt with spray database knowledge
            $systemPrompt = $this->buildSpraySystemPrompt();

            // Generate a consistent seed based on input data for reproducibility
            $seedData = json_encode([
                'plant' => $plantData['name'] ?? '',
                'farm' => $farmData['name'] ?? '',
                'spray' => $currentSpray['spray_name'] ?? '',
                'date' => now()->format('Y-m-d'), // Same seed for same day
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
                'temperature' => 0.1, // Very low temperature for consistent, deterministic recommendations
                'max_tokens' => 1500,
                'seed' => $seed, // Use seed for reproducible outputs
                'top_p' => 0.95, // Slightly restrict token sampling for consistency
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? null;

                if ($content) {
                    // Try to parse as JSON if structured response
                    $cleanedContent = preg_replace('/```(?:json)?\s*/', '', $content);
                    $cleanedContent = preg_replace('/```\s*$/', '', $cleanedContent);
                    $cleanedContent = trim($cleanedContent);

                    // Try to extract JSON object from content
                    if (preg_match('/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/s', $cleanedContent, $jsonMatch)) {
                        $recommendation = json_decode($jsonMatch[0], true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($recommendation)) {
                            return $this->normalizeSprayRecommendation($recommendation);
                        }
                    }

                    // Fallback: return the raw content in a structured format
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

        // Fetch all sprays from database to enrich AI knowledge
        try {
            $sprays = \App\Models\Spray::with(['plant', 'farm'])->get();

            if ($sprays->isNotEmpty()) {
                $basePrompt .= "=== SPRAY DATABASE KNOWLEDGE ===\n";
                $basePrompt .= "You have access to the following spray records from the farm database. Use this information to provide more accurate recommendations:\n\n";

                // Group sprays by plant for better context
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

                // Add summary statistics
                $totalSprays = $sprays->count();
                $uniqueChemicals = $sprays->pluck('chemical_name')->unique()->count();
                $uniquePlants = $spraysByPlant->count();

                $basePrompt .= "=== DATABASE SUMMARY ===\n";
                $basePrompt .= "Total spray records: {$totalSprays}\n";
                $basePrompt .= "Unique chemicals: {$uniqueChemicals}\n";
                $basePrompt .= "Plants covered: {$uniquePlants}\n\n";

                // Add common patterns and insights
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

        // Plant Information
        $prompt .= "PLANT INFORMATION:\n";
        $prompt .= '- Plant Name: '.($plantData['name'] ?? 'Unknown')."\n";
        $prompt .= '- Plant Details: '.($plantData['info'] ?? 'No details available')."\n";
        $prompt .= '- Growth Stage: ';

        // Calculate days since planting if available
        if (isset($farmData['created_at'])) {
            $plantingDate = \Carbon\Carbon::parse($farmData['created_at']);
            $daysSincePlanting = $plantingDate->diffInDays(now());
            $prompt .= "Approximately {$daysSincePlanting} days since planting\n";
        } else {
            $prompt .= "Unknown\n";
        }

        $prompt .= "\n";

        // Farm Information
        $prompt .= "FARM INFORMATION:\n";
        $prompt .= '- Farm Name: '.($farmData['name'] ?? 'Unknown Farm')."\n";

        // Handle location - note: database column is 'longitute' (typo)
        $latitude = $farmData['latitude'] ?? 'Unknown';
        $longitude = $farmData['longitute'] ?? $farmData['longitude'] ?? 'Unknown';
        $prompt .= "- Location: Latitude {$latitude}, Longitude {$longitude}\n";
        $prompt .= "- Current Date: {$currentDate}\n";
        $prompt .= "- Current Season: {$currentSeason}\n\n";

        // Current Weather Conditions
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

        // Weather Forecast (if available)
        if (! empty($weatherData['forecast'])) {
            $prompt .= "7-DAY WEATHER FORECAST:\n";
            $prompt .= $this->summarizeWeatherForecast($weatherData['forecast']);
            $prompt .= "\n";
        }

        // Spray History
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

        // Current Spray to Plan (if provided)
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

        // Analysis Instructions
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

        // Assuming Northern Hemisphere - adjust based on farm location if needed
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
