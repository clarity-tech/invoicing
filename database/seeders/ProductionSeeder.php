<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    /**
     * Run the production database seeds.
     * This seeder is designed to run safely in production and staging environments.
     */
    public function run(): void
    {
        if (!$this->isProductionSafeEnvironment()) {
            $this->command->error('Production seeders can only be run in production, staging, or testing environments.');
            $this->command->error('Current environment: ' . app()->environment());
            $this->command->error('To run production seeders, set APP_ENV to production, staging, or testing.');
            
            return;
        }

        $this->command->info('Running production seeders in ' . app()->environment() . ' environment...');
        
        // Run production-specific seeders
        $this->call([
            ProductionUserSeeder::class,
            ProductionCustomerSeeder::class,
            ProductionInvoiceSeeder::class,
        ]);

        $this->command->info('Production seeders completed successfully!');
    }

    /**
     * Check if we're in a production-safe environment.
     */
    protected function isProductionSafeEnvironment(): bool
    {
        return app()->environment(['production', 'staging', 'testing']);
    }
}