<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_id' => Service::factory(),
            'user_id' => User::factory(),
            'description' => fake()->paragraphs(2, true),
            'status' => fake()->randomElement(['pending', 'resolved']),
        ];
    }
}
