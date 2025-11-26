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
}
