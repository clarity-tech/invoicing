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
                $this->command->info('Note: a non-interactive run takes the default answer, which is "no".');

                return;
            }
        }

        // Show what will be created
        $this->command->info('Creating production data:');
        $this->command->info('• Clarity Technologies organization with real business details');
        $this->command->info('• Real customers (RxNow Pharmacy LLC, DocOnline Health India, Krishna Institute)');
        $this->command->info('• Sample invoices and an estimate in INR and AED');

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
        $this->command->info('Login with: manash@claritytech.io or accounts@claritytech.io (password: password)');
        $this->command->info('Safe to re-run: existing records are matched rather than duplicated.');
    }
}
