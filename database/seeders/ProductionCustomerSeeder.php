<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Location;
use App\Models\Organization;
use App\ValueObjects\ContactCollection;
use Illuminate\Database\Seeder;

class ProductionCustomerSeeder extends Seeder
{
    /**
     * Run the production customer seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating production customers for Clarity Technologies...');

        // Get Clarity Technologies organization
        $clarityOrg = Organization::where('company_name', 'Clarity Technologies')->first();

        if (! $clarityOrg) {
            $this->command->error('Clarity Technologies organization not found. Please run ProductionUserSeeder first.');

            return;
        }

        // Create RxNow Pharmacy LLC (Dubai customer)
        $rxnowCustomer = Customer::firstOrCreate([
            'organization_id' => $clarityOrg->id,
            'name' => 'RxNow Pharmacy LLC',
        ], [
            'phone' => '+97145551234',
            'phone_country' => 'AE',
            'emails' => new ContactCollection([['name' => 'Billing', 'email' => 'billing@rxnow.ae'], ['name' => 'Info', 'email' => 'info@rxnow.ae']]),
        ]);

        $rxnowLocation = $this->locationFor($rxnowCustomer, [
            'name' => 'RxNow Pharmacy LLC',
            'address_line_1' => 'Shop 12, The Wings block B',
            'address_line_2' => 'Arjan',
            'city' => 'Dubai',
            'state' => 'Dubai',
            'country' => 'AE',
            'postal_code' => '00000',
        ]);

        $rxnowCustomer->update(['primary_location_id' => $rxnowLocation->id]);

        // Create DocOnline Health India Private Limited (Bangalore customer)
        $docOnlineCustomer = Customer::firstOrCreate([
            'organization_id' => $clarityOrg->id,
            'name' => 'DOCONLINE HEALTH INDIA PRIVATE LIMITED',
        ], [
            'phone' => '+918045678901',
            'phone_country' => 'IN',
            'emails' => new ContactCollection([['name' => 'Billing', 'email' => 'billing@doconline.in'], ['name' => 'Accounts', 'email' => 'accounts@doconline.in']]),
        ]);

        $docOnlineLocation = $this->locationFor($docOnlineCustomer, [
            'name' => 'DocOnline Health India Pvt Ltd',
            'address_line_1' => '6th Floor, Unit nos 3 & 4. Vayudooth Chambers 15 & 16',
            'address_line_2' => 'Trinity Junction, Mahatma Gandhi Rd',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'country' => 'IN',
            'postal_code' => '560001',
            'tax_id' => '29AAFCD9711R1ZV',
        ]);

        $docOnlineCustomer->update(['primary_location_id' => $docOnlineLocation->id]);

        // Create Krishna Institute of Medical Sciences Limited (Hyderabad customer)
        $krishnaCustomer = Customer::firstOrCreate([
            'organization_id' => $clarityOrg->id,
            'name' => 'Krishna Institute of Medical Sciences Limited',
        ], [
            'phone' => '+914045678901',
            'phone_country' => 'IN',
            'emails' => new ContactCollection([['name' => 'Procurement', 'email' => 'procurement@kims.in'], ['name' => 'Finance', 'email' => 'finance@kims.in']]),
        ]);

        $krishnaLocation = $this->locationFor($krishnaCustomer, [
            'name' => 'Krishna Institute of Medical Sciences Limited',
            'address_line_1' => '1-8-31/1, MINISTER ROAD',
            'address_line_2' => null,
            'city' => 'Secunderabad',
            'state' => 'Telangana',
            'country' => 'IN',
            'postal_code' => '500003',
            'tax_id' => '36AACCK2540G1ZU',
        ]);

        $krishnaCustomer->update(['primary_location_id' => $krishnaLocation->id]);

        $this->command->info('✓ Created RxNow Pharmacy LLC (Dubai, AED)');
        $this->command->info('  Address: Shop 12, The Wings block B, Arjan, Dubai, UAE');
        $this->command->info('  Emails: billing@rxnow.ae, info@rxnow.ae');

        $this->command->info('✓ Created DocOnline Health India Pvt Ltd (Bangalore, INR)');
        $this->command->info('  Address: 6th Floor, Unit nos 3 & 4. Vayudooth Chambers 15 & 16, Trinity Junction, Mahatma Gandhi Rd, Bengaluru 560001 Karnataka');
        $this->command->info('  GSTIN: 29AAFCD9711R1ZV');

        $this->command->info('✓ Created Krishna Institute of Medical Sciences Limited (Hyderabad, INR)');
        $this->command->info('  Address: 1-8-31/1, MINISTER ROAD, Secunderabad 500003 Telangana');
        $this->command->info('  GSTIN: 36AACCK2540G1ZU');

        $this->command->info('Production customers created successfully!');
    }

    /**
     * Create (or reuse) a customer's location. Matched on the owning customer
     * and location name so the seeder stays safe to re-run.
     *
     * @param  array<string, mixed>  $attributes
     */
    private function locationFor(Customer $customer, array $attributes): Location
    {
        return Location::firstOrCreate([
            'locatable_type' => Customer::class,
            'locatable_id' => $customer->id,
            'name' => $attributes['name'],
        ], $attributes);
    }
}
