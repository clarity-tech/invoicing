<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Location;
use App\Models\Organization;
use App\ValueObjects\ContactCollection;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerSeeder extends ProductionSafeSeeder
{
    protected function seed(): void
    {
        $this->info('Seeding customers using factory states...');

        $organizations = Organization::with('primaryLocation')->get();

        foreach ($organizations as $organization) {
            $this->createCustomersForOrganization($organization);
        }

        $this->info('Created customers and locations successfully!');
    }

    private function createCustomersForOrganization(Organization $organization): void
    {
        // Skip personal teams (only create customers for business organizations)
        if ($organization->personal_team) {
            return;
        }

        $customerCount = 0;

        // Create domestic customers
        $domesticFactory = $this->getCustomerFactoryForOrganization($organization);
        $domesticCount = $this->getDomesticCustomerCount($organization);

        $domesticFactory
            ->count($domesticCount)
            ->for($organization)
            ->create();
        $customerCount += $domesticCount;

        // Create foreign customers for Indian organizations
        $foreignCustomers = $this->createForeignCustomersForOrganization($organization);
        $customerCount += count($foreignCustomers);

        $this->info("✓ Created {$customerCount} customers for {$organization->name}");
    }

    private function getDomesticCustomerCount(Organization $organization): int
    {
        return match (true) {
            str_contains($organization->name, 'Manufacturing') => 5,
            str_contains($organization->name, 'TechStart') => 5,
            str_contains($organization->name, 'EuroConsult') => 6,
            str_contains($organization->name, 'Demo Company') => 3, // Reduced to make room for foreign customers
            str_contains($organization->name, 'Dubai Trading') => 2,
            str_contains($organization->name, 'GlobalCorp Holdings') => 2, // Reduced for foreign customers
            str_contains($organization->name, 'GlobalCorp Tech') => 2, // Reduced for foreign customers
            str_contains($organization->name, 'GlobalCorp Business') => 3,
            default => 2,
        };
    }

    private function getCustomerFactoryForOrganization(Organization $organization): Factory
    {
        return match (true) {
            str_contains($organization->name, 'Manufacturing') => Customer::factory()->usManufacturingEstablished(),

            str_contains($organization->name, 'TechStart') => Customer::factory()->techCustomer()->usCustomer()->establishedCustomer(),

            str_contains($organization->name, 'EuroConsult') => Customer::factory()->germanConsultingHighValue(),

            str_contains($organization->name, 'Demo Company') => Customer::factory()->indianRetailNew(),

            str_contains($organization->name, 'Dubai Trading') => Customer::factory()->uaeTechEstablished(),

            str_contains($organization->name, 'GlobalCorp Holdings') => Customer::factory()->highValueCustomer()->usCustomer(),

            str_contains($organization->name, 'GlobalCorp Tech') => Customer::factory()->techCustomer()->indianCustomer()->establishedCustomer(),

            str_contains($organization->name, 'GlobalCorp Business') => Customer::factory()->consultingCustomer()->internationalCustomer(),

            default => Customer::factory()->withLocation(), // Default fallback
        };
    }

    private function createForeignCustomersForOrganization(Organization $organization): array
    {
        $foreignCustomers = [];

        // Add foreign customers for Indian organizations
        if (str_contains($organization->name, 'Demo Company')) {
            // Add RxNow LLC as UAE customer
            $rxnow = Customer::factory()
                ->for($organization)
                ->create([
                    'name' => 'RxNow LLC',
                    'emails' => new ContactCollection([['name' => 'Billing', 'email' => 'billing@rxnow.test'], ['name' => 'Finance', 'email' => 'finance@rxnow.test']]),
                    'phone' => '+971-4-1234567',
                ]);

            // Create Dubai location for RxNow
            $location = Location::create([
                'name' => 'RxNow Healthcare HQ',
                'address_line_1' => 'Dubai Healthcare City',
                'address_line_2' => 'Building 64, Office 4001',
                'city' => 'Dubai',
                'state' => 'Dubai',
                'country' => 'AE',
                'postal_code' => '00000',
                'locatable_type' => Customer::class,
                'locatable_id' => $rxnow->id,
            ]);

            $rxnow->update(['primary_location_id' => $location->id]);
            $foreignCustomers[] = $rxnow;

            // Add 1115inc as another UAE customer
            $inc1115 = Customer::factory()
                ->for($organization)
                ->create([
                    'name' => '1115inc',
                    'emails' => new ContactCollection([['name' => 'Ayshwarya', 'email' => 'ayshwarya@1115inc.test'], ['name' => 'Consultant', 'email' => 'consult@1115inc.test']]),
                    'phone' => '+971-4-7654321',
                ]);

            $location1115 = Location::create([
                'name' => '1115inc Office',
                'address_line_1' => 'Al Warsan Towers, 305',
                'address_line_2' => 'Barsha Heights',
                'city' => 'Dubai',
                'state' => 'Dubai',
                'country' => 'AE',
                'postal_code' => '00000',
                'locatable_type' => Customer::class,
                'locatable_id' => $inc1115->id,
            ]);

            $inc1115->update(['primary_location_id' => $location1115->id]);
            $foreignCustomers[] = $inc1115;
        }

        if (str_contains($organization->name, 'GlobalCorp Holdings')) {
            // Add US customer
            $usCustomer = Customer::factory()
                ->usCustomer()
                ->highValueCustomer()
                ->for($organization)
                ->create([
                    'name' => 'Fortune 500 Enterprise Corp',
                ]);
            $foreignCustomers[] = $usCustomer;

            // Add European customer
            $eurCustomer = Customer::factory()
                ->germanCustomer()
                ->consultingCustomer()
                ->for($organization)
                ->create([
                    'name' => 'European Consulting GmbH',
                ]);
            $foreignCustomers[] = $eurCustomer;
        }

        if (str_contains($organization->name, 'GlobalCorp Tech')) {
            // Add US tech customer
            $usTechCustomer = Customer::factory()
                ->usCustomer()
                ->techCustomer()
                ->for($organization)
                ->create([
                    'name' => 'Silicon Valley Tech Inc',
                ]);
            $foreignCustomers[] = $usTechCustomer;
        }

        return $foreignCustomers;
    }
}
