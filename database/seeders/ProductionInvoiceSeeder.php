<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Organization;
use App\ValueObjects\ContactCollection;
use Illuminate\Database\Seeder;

class ProductionInvoiceSeeder extends Seeder
{
    /**
     * Run the production invoice seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating sample invoices for production customers...');

        // Get Clarity Technologies organization
        $clarityOrg = Organization::where('company_name', 'Clarity Technologies')->first();
        
        if (!$clarityOrg) {
            $this->command->error('Clarity Technologies organization not found. Please run ProductionUserSeeder first.');
            return;
        }

        // Get customers
        $rxnowCustomer = Customer::where('name', 'RxNow Pharmacy LLC')->where('organization_id', $clarityOrg->id)->first();
        $docOnlineCustomer = Customer::where('name', 'DOCONLINE HEALTH INDIA PRIVATE LIMITED')->where('organization_id', $clarityOrg->id)->first();
        $krishnaCustomer = Customer::where('name', 'Krishna Institute of Medical Sciences Limited')->where('organization_id', $clarityOrg->id)->first();

        if (!$rxnowCustomer || !$docOnlineCustomer || !$krishnaCustomer) {
            $this->command->error('Production customers not found. Please run ProductionCustomerSeeder first.');
            return;
        }

        // Create sample invoice for RxNow (AED - Dubai customer)
        $rxnowInvoice = Invoice::create([
            'organization_id' => $clarityOrg->id,
            'organization_location_id' => $clarityOrg->primary_location_id,
            'customer_id' => $rxnowCustomer->id,
            'customer_location_id' => $rxnowCustomer->primary_location_id,
            'invoice_number' => 'CT-INV-001',
            'issued_at' => now()->subDays(15),
            'due_at' => now()->addDays(15),
            'status' => 'sent',
            'type' => 'invoice',
            'currency' => 'AED',
            'subtotal' => 367500, // AED 3,675.00
            'tax' => 18375, // 5% VAT
            'total' => 385875, // AED 3,858.75
            'email_recipients' => ['billing@rxnow.ae', 'info@rxnow.ae'],
            'notes' => 'Healthcare management system implementation and support services.',
            'terms' => 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.',
        ]);

        // Add invoice items for RxNow
        InvoiceItem::create([
            'invoice_id' => $rxnowInvoice->id,
            'description' => 'Healthcare Management System - Annual License',
            'quantity' => 1,
            'unit_price' => 245000, // AED 2,450.00
            'tax_rate' => 5.000, // 5% UAE VAT
        ]);

        InvoiceItem::create([
            'invoice_id' => $rxnowInvoice->id,
            'description' => 'System Implementation & Training',
            'quantity' => 1,
            'unit_price' => 122500, // AED 1,225.00
            'tax_rate' => 5.000, // 5% UAE VAT
        ]);

        // Create sample invoice for DocOnline (INR - Bangalore customer)
        $docOnlineInvoice = Invoice::create([
            'organization_id' => $clarityOrg->id,
            'organization_location_id' => $clarityOrg->primary_location_id,
            'customer_id' => $docOnlineCustomer->id,
            'customer_location_id' => $docOnlineCustomer->primary_location_id,
            'invoice_number' => 'CT-INV-002',
            'issued_at' => now()->subDays(10),
            'due_at' => now()->addDays(20),
            'status' => 'draft',
            'type' => 'invoice',
            'currency' => 'INR',
            'subtotal' => 12500000, // INR 1,25,000.00
            'tax' => 2250000, // 18% GST
            'total' => 14750000, // INR 1,47,500.00
            'email_recipients' => ['billing@doconline.in', 'accounts@doconline.in'],
            'notes' => 'Digital health platform development and integration services.',
            'terms' => 'Payment due within 30 days. GST as applicable.',
        ]);

        // Add invoice items for DocOnline
        InvoiceItem::create([
            'invoice_id' => $docOnlineInvoice->id,
            'description' => 'Digital Health Platform Development',
            'quantity' => 1,
            'unit_price' => 10000000, // INR 1,00,000.00
            'tax_rate' => 18.000, // 18% GST
        ]);

        InvoiceItem::create([
            'invoice_id' => $docOnlineInvoice->id,
            'description' => 'API Integration & Testing',
            'quantity' => 1,
            'unit_price' => 2500000, // INR 25,000.00
            'tax_rate' => 18.000, // 18% GST
        ]);

        // Create sample estimate for Krishna Institute (INR - Hyderabad customer)
        $krishnaEstimate = Invoice::create([
            'organization_id' => $clarityOrg->id,
            'organization_location_id' => $clarityOrg->primary_location_id,
            'customer_id' => $krishnaCustomer->id,
            'customer_location_id' => $krishnaCustomer->primary_location_id,
            'invoice_number' => 'CT-EST-001',
            'issued_at' => now()->subDays(5),
            'due_at' => now()->addDays(25),
            'status' => 'draft',
            'type' => 'estimate',
            'currency' => 'INR',
            'subtotal' => 20000000, // INR 2,00,000.00
            'tax' => 3600000, // 18% GST
            'total' => 23600000, // INR 2,36,000.00
            'email_recipients' => ['procurement@kims.in', 'finance@kims.in'],
            'notes' => 'Hospital management system with patient records and billing integration.',
            'terms' => 'Estimate valid for 30 days. 50% advance required upon acceptance.',
        ]);

        // Add estimate items for Krishna Institute
        InvoiceItem::create([
            'invoice_id' => $krishnaEstimate->id,
            'description' => 'Hospital Management System - Core Module',
            'quantity' => 1,
            'unit_price' => 15000000, // INR 1,50,000.00
            'tax_rate' => 18.000, // 18% GST
        ]);

        InvoiceItem::create([
            'invoice_id' => $krishnaEstimate->id,
            'description' => 'Patient Records & Billing Integration',
            'quantity' => 1,
            'unit_price' => 5000000, // INR 50,000.00
            'tax_rate' => 18.000, // 18% GST
        ]);

        $this->command->info('✓ Created invoice CT-INV-001 for RxNow Pharmacy LLC (AED 3,858.75)');
        $this->command->info('✓ Created invoice CT-INV-002 for DocOnline Health India (INR 1,47,500.00)');
        $this->command->info('✓ Created estimate CT-EST-001 for Krishna Institute (INR 2,36,000.00)');
        $this->command->info('Sample invoices and estimates created successfully!');
    }
}