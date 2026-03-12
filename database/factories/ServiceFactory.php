<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\Type;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type_id' => Type::query()->inRandomOrder()->value('id') ?? Type::factory(),
            'name' => fake()->unique()->words(3, true),
            'description' => fake()->optional(0.8)->paragraph(),
            'created_by' => User::factory(),
        ];
    }
}
