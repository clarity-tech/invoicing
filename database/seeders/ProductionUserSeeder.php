<?php

namespace Database\Seeders;

use App\Models\Location;
use App\Models\Organization;
use App\Models\User;
use App\ValueObjects\ContactCollection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductionUserSeeder extends Seeder
{
    /**
     * Run the production user seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating Clarity Technologies organization and users...');

        // Create Clarity Technologies organization owner user
        $clarityOwner = User::create([
            'name' => 'Manash Sonowal',
            'email' => 'manash@claritytech.io',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'current_team_id' => null,
        ]);

        // Create Clarity Technologies organization
        $clarityOrg = Organization::create([
            'name' => 'Clarity Technologies',
            'user_id' => $clarityOwner->id,
            'personal_team' => false,
            'company_name' => 'Clarity Technologies',
            'tax_number' => '18ASBPB0118P1ZX',
            'registration_number' => 'U74999AS2020PTC009876',
            'emails' => new ContactCollection([['name' => 'Accounts', 'email' => 'accounts@claritytech.io'], ['name' => 'Manash', 'email' => 'manash@claritytech.io']]),
            'phone' => '+91-94010-12345',
            'website' => 'https://claritytech.io',
            'currency' => 'INR',
            'country_code' => 'IN',
            'financial_year_type' => 'april_march',
            'financial_year_start_month' => 4,
            'financial_year_start_day' => 1,
            'setup_completed_at' => now(),
            'notes' => 'Technology solutions company based in Assam, India specializing in software development and consulting.',
        ]);

        // Set current team for the owner
        $clarityOwner->update(['current_team_id' => $clarityOrg->id]);

        // Create Clarity Technologies head office location
        $clarityLocation = Location::create([
            'name' => 'Clarity Technologies Head Office',
            'address_line_1' => 'Kushal Nagar Namghar Path, House No: 110',
            'address_line_2' => 'Ground Floor',
            'city' => 'Moranhat',
            'state' => 'Assam',
            'country' => 'IN',
            'postal_code' => '785675',
            'locatable_type' => Organization::class,
            'locatable_id' => $clarityOrg->id,
        ]);

        // Update organization with primary location
        $clarityOrg->update(['primary_location_id' => $clarityLocation->id]);

        // Create accounts user
        $accountsUser = User::create([
            'name' => 'Accounts Department',
            'email' => 'accounts@claritytech.io',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'current_team_id' => $clarityOrg->id,
        ]);

        // Add accounts user as team member
        $clarityOrg->users()->attach($accountsUser, ['role' => 'admin']);

        $this->command->info('✓ Created Clarity Technologies organization');
        $this->command->info('✓ Owner: manash@claritytech.io (password: password)');
        $this->command->info('✓ Accounts: accounts@claritytech.io (password: password)');
        $this->command->info('✓ Organization: Clarity Technologies (GSTIN: 18ASBPB0118P1ZX)');
        $this->command->info('✓ Address: Kushal Nagar Namghar Path, House No: 110, Ground Floor, Moranhat Assam 785675 India');
        $this->command->info('✓ Website: https://claritytech.io');
    }
}