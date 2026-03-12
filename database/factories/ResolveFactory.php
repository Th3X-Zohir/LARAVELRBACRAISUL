<?php

namespace Database\Factories;

use App\Models\Resolve;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Resolve>
 */
class ResolveFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'report_id' => Report::factory(),
            'status' => fake()->randomElement(['pending', 'resolved']),
            'comment' => fake()->optional(0.9)->sentence(),
            'updated_by' => User::factory(),
        ];
    }
}
