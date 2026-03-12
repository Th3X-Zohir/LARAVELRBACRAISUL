<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\Resolve;
use App\Models\Responsibility;
use App\Models\Role;
use App\Models\Service;
use App\Models\Type;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roleNames = ['super', 'admin', 'user'];

        foreach ($roleNames as $name) {
            Role::firstOrCreate(['name' => $name]);
        }

        $roles = Role::query()->whereIn('name', $roleNames)->get();
        $superRoleId = Role::query()->where('name', 'super')->value('id') ?? $roles->first()?->id;
        $adminRoleId = Role::query()->where('name', 'admin')->value('id') ?? $roles->first()?->id;
        $userRoleId = Role::query()->where('name', 'user')->value('id') ?? $roles->first()?->id;

        $super = User::firstOrCreate(
            ['email' => 'super@example.com'],
            [
                'name' => 'Super User',
                'password' => 'password',
            ],
        );

        if ($superRoleId && $super->role_id !== $superRoleId) {
            $super->forceFill(['role_id' => $superRoleId])->save();
        }

        if (!$super->phone) {
            $super->forceFill(['phone' => fake()->e164PhoneNumber()])->save();
        }

        if (!$super->email_verified_at) {
            $super->forceFill(['email_verified_at' => now()])->save();
        }

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => 'password',
            ],
        );

        if ($adminRoleId && $admin->role_id !== $adminRoleId) {
            $admin->forceFill(['role_id' => $adminRoleId])->save();
        }

        if (!$admin->phone) {
            $admin->forceFill(['phone' => fake()->e164PhoneNumber()])->save();
        }

        if (!$admin->email_verified_at) {
            $admin->forceFill(['email_verified_at' => now()])->save();
        }

        $users = User::factory()
            ->count(30)
            ->state(fn () => ['role_id' => $userRoleId])
            ->create();

        $allUsers = $users->push($admin, $super);

        $typeNames = [];
        $types = collect();

        foreach ($typeNames as $name) {
            $types->push(
                Type::firstOrCreate(['name' => $name])
            );
        }

        $services = Service::factory()
            ->count(10)
            ->recycle($allUsers)
            ->recycle($types)
            ->create();

        $targetResponsibilities = 30;
        $createdResponsibilities = 0;

        while ($createdResponsibilities < $targetResponsibilities) {
            $userId = $allUsers->random()->id;
            $serviceId = $services->random()->id;
            $assignedById = $allUsers->random()->id;

            $responsibility = Responsibility::firstOrCreate(
                ['user_id' => $userId, 'service_id' => $serviceId],
                ['assigned_by' => $assignedById],
            );

            if ($responsibility->wasRecentlyCreated) {
                $createdResponsibilities++;
            }
        }

        $reports = Report::factory()
            ->count(50)
            ->recycle($allUsers)
            ->recycle($services)
            ->create();

        Resolve::factory()
            ->count(35)
            ->recycle($reports)
            ->recycle($allUsers)
            ->create();
    }
}
