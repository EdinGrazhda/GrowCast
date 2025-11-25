<?php

namespace App\Enums;

enum WeatherStatus: string
{
    case OPTIMAL = 'Optimal';
    case ACCEPTABLE = 'Acceptable';
    case POOR = 'Poor';

    /**
     * Get the color associated with the status
     */
    public function color(): string
    {
        return match ($this) {
            self::OPTIMAL => '#22c55e',      // Green
            self::ACCEPTABLE => '#f97316',   // Orange
            self::POOR => '#ef4444',         // Red
        };
    }

    /**
     * Get the background color for the status badge
     */
    public function backgroundColor(): string
    {
        return match ($this) {
            self::OPTIMAL => '#22c55e20',    // Light green
            self::ACCEPTABLE => '#f9731620', // Light orange
            self::POOR => '#ef444420',       // Light red
        };
    }

    /**
     * Get all status options
     */
    public static function options(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }

    /**
     * Get status with color information
     */
    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'color' => $this->color(),
            'backgroundColor' => $this->backgroundColor(),
        ];
    }
}
