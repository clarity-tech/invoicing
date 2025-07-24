<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    /**
     * Run the production database seeds.
     * This seeder can be run in any environment but asks for confirmation in production.
     */
    public function run(): void
    {
        // Show environment info
        $this->command->info('Running production seeders in '.app()->environment().' environment...');

        // Ask for confirmation in production/staging environments
        if (app()->environment(['production', 'staging'])) {
            $this->command->warn('⚠️  You are about to run production seeders in '.strtoupper(app()->environment()).' environment!');
            $this->command->warn('This will create real business data for Clarity Technologies.');
            $this->command->warn('Make sure this is what you want to do.');

            if (! $this->command->confirm('Do you want to continue?', false)) {
                $this->command->info('Production seeding cancelled.');

                return;
            }
        }

        // Show what will be created
        $this->command->info('Creating production data:');
        $this->command->info('• Clarity Technologies organization with real business details');
        $this->command->info('• Real customers (RxNow LLC, Techno Park, etc.)');
        $this->command->info('• Sample invoices in INR and AED currencies');

        $startTime = microtime(true);

        // Run production-specific seeders
        $this->call([
            ProductionUserSeeder::class,
            ProductionCustomerSeeder::class,
            ProductionInvoiceSeeder::class,
        ]);

        $endTime = microtime(true);
        $executionTime = round($endTime - $startTime, 2);

        $this->command->info("✅ Production seeders completed successfully in {$executionTime} seconds!");
        $this->command->info('Login with: admin@claritytech.io (password: password)');
    }
}
