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
        
        if (!$clarityOrg) {
            $this->command->error('Clarity Technologies organization not found. Please run ProductionUserSeeder first.');
            return;
        }

        // Create RxNow Pharmacy LLC (Dubai customer)
        $rxnowCustomer = Customer::create([
            'name' => 'RxNow Pharmacy LLC',
            'phone' => '+971-4-5551234',
            'emails' => new ContactCollection([['name' => 'Billing', 'email' => 'billing@rxnow.ae'], ['name' => 'Info', 'email' => 'info@rxnow.ae']]),
            'organization_id' => $clarityOrg->id,
        ]);

        $rxnowLocation = Location::create([
            'name' => 'RxNow Pharmacy LLC',
            'address_line_1' => 'Shop 12, The Wings block B',
            'address_line_2' => 'Arjan',
            'city' => 'Dubai',
            'state' => 'Dubai',
            'country' => 'AE',
            'postal_code' => '00000',
            'locatable_type' => Customer::class,
            'locatable_id' => $rxnowCustomer->id,
        ]);

        $rxnowCustomer->update(['primary_location_id' => $rxnowLocation->id]);

        // Create DocOnline Health India Private Limited (Bangalore customer)
        $docOnlineCustomer = Customer::create([
            'name' => 'DOCONLINE HEALTH INDIA PRIVATE LIMITED',
            'phone' => '+91-80-4567-8901',
            'emails' => new ContactCollection([['name' => 'Billing', 'email' => 'billing@doconline.in'], ['name' => 'Accounts', 'email' => 'accounts@doconline.in']]),
            'organization_id' => $clarityOrg->id,
        ]);

        $docOnlineLocation = Location::create([
            'name' => 'DocOnline Health India Pvt Ltd',
            'address_line_1' => '6th Floor, Unit nos 3 & 4. Vayudooth Chambers 15 & 16',
            'address_line_2' => 'Trinity Junction, Mahatma Gandhi Rd',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'country' => 'IN',
            'postal_code' => '560001',
            'gstin' => '29AAFCD9711R1ZV',
            'locatable_type' => Customer::class,
            'locatable_id' => $docOnlineCustomer->id,
        ]);

        $docOnlineCustomer->update(['primary_location_id' => $docOnlineLocation->id]);

        // Create Krishna Institute of Medical Sciences Limited (Hyderabad customer)
        $krishnaCustomer = Customer::create([
            'name' => 'Krishna Institute of Medical Sciences Limited',
            'phone' => '+91-40-4567-8901',
            'emails' => new ContactCollection([['name' => 'Procurement', 'email' => 'procurement@kims.in'], ['name' => 'Finance', 'email' => 'finance@kims.in']]),
            'organization_id' => $clarityOrg->id,
        ]);

        $krishnaLocation = Location::create([
            'name' => 'Krishna Institute of Medical Sciences Limited',
            'address_line_1' => '1-8-31/1, MINISTER ROAD',
            'address_line_2' => null,
            'city' => 'Secunderabad',
            'state' => 'Telangana',
            'country' => 'IN',
            'postal_code' => '500003',
            'gstin' => '36AACCK2540G1ZU',
            'locatable_type' => Customer::class,
            'locatable_id' => $krishnaCustomer->id,
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
}