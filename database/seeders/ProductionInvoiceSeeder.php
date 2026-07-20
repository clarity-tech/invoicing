<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Organization;
use App\Services\InvoiceCalculator;
use Illuminate\Database\Seeder;

class ProductionInvoiceSeeder extends Seeder
{
    public function __construct(
        private readonly InvoiceCalculator $calculator,
    ) {}

    /**
     * Run the production invoice seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating sample invoices for production customers...');

        // Get Clarity Technologies organization
        $clarityOrg = Organization::where('company_name', 'Clarity Technologies')->first();

        if (! $clarityOrg) {
            $this->command->error('Clarity Technologies organization not found. Please run ProductionUserSeeder first.');

            return;
        }

        // Get customers
        $rxnowCustomer = Customer::where('name', 'RxNow Pharmacy LLC')->where('organization_id', $clarityOrg->id)->first();
        $docOnlineCustomer = Customer::where('name', 'DOCONLINE HEALTH INDIA PRIVATE LIMITED')->where('organization_id', $clarityOrg->id)->first();
        $krishnaCustomer = Customer::where('name', 'Krishna Institute of Medical Sciences Limited')->where('organization_id', $clarityOrg->id)->first();

        if (! $rxnowCustomer || ! $docOnlineCustomer || ! $krishnaCustomer) {
            $this->command->error('Production customers not found. Please run ProductionCustomerSeeder first.');

            return;
        }

        // Sample invoice for RxNow (AED - Dubai customer)
        $rxnowInvoice = $this->createDocument($clarityOrg, $rxnowCustomer, [
            'invoice_number' => 'CT-INV-001',
            'type' => 'invoice',
            'status' => 'sent',
            'currency' => 'AED',
            'issued_at' => now()->subDays(15),
            'due_at' => now()->addDays(15),
            'email_recipients' => [
                ['email' => 'billing@rxnow.ae', 'checked' => true],
                ['email' => 'info@rxnow.ae', 'checked' => true],
            ],
            'notes' => 'Healthcare management system implementation and support services.',
            'terms' => 'Payment due within 30 days. Late payments subject to 1.5% monthly interest.',
        ], [
            [
                'description' => 'Healthcare Management System - Annual License',
                'quantity' => 1,
                'unit_price' => 245000, // AED 2,450.00
                'tax_rate' => 500, // 5% UAE VAT
            ],
            [
                'description' => 'System Implementation & Training',
                'quantity' => 1,
                'unit_price' => 122500, // AED 1,225.00
                'tax_rate' => 500, // 5% UAE VAT
            ],
        ]);

        // Sample invoice for DocOnline (INR - Bangalore customer)
        $docOnlineInvoice = $this->createDocument($clarityOrg, $docOnlineCustomer, [
            'invoice_number' => 'CT-INV-002',
            'type' => 'invoice',
            'status' => 'draft',
            'currency' => 'INR',
            'issued_at' => now()->subDays(10),
            'due_at' => now()->addDays(20),
            'email_recipients' => [
                ['email' => 'billing@doconline.in', 'checked' => true],
                ['email' => 'accounts@doconline.in', 'checked' => true],
            ],
            'notes' => 'Digital health platform development and integration services.',
            'terms' => 'Payment due within 30 days. GST as applicable.',
        ], [
            [
                'description' => 'Digital Health Platform Development',
                'quantity' => 1,
                'unit_price' => 10000000, // INR 1,00,000.00
                'tax_rate' => 1800, // 18% GST
            ],
            [
                'description' => 'API Integration & Testing',
                'quantity' => 1,
                'unit_price' => 2500000, // INR 25,000.00
                'tax_rate' => 1800, // 18% GST
            ],
        ]);

        // Sample estimate for Krishna Institute (INR - Hyderabad customer)
        $krishnaEstimate = $this->createDocument($clarityOrg, $krishnaCustomer, [
            'invoice_number' => 'CT-EST-001',
            'type' => 'estimate',
            'status' => 'draft',
            'currency' => 'INR',
            'issued_at' => now()->subDays(5),
            'due_at' => now()->addDays(25),
            'email_recipients' => [
                ['email' => 'procurement@kims.in', 'checked' => true],
                ['email' => 'finance@kims.in', 'checked' => true],
            ],
            'notes' => 'Hospital management system with patient records and billing integration.',
            'terms' => 'Estimate valid for 30 days. 50% advance required upon acceptance.',
        ], [
            [
                'description' => 'Hospital Management System - Core Module',
                'quantity' => 1,
                'unit_price' => 15000000, // INR 1,50,000.00
                'tax_rate' => 1800, // 18% GST
            ],
            [
                'description' => 'Patient Records & Billing Integration',
                'quantity' => 1,
                'unit_price' => 5000000, // INR 50,000.00
                'tax_rate' => 1800, // 18% GST
            ],
        ]);

        $this->command->info("✓ Created invoice {$rxnowInvoice->invoice_number} for RxNow Pharmacy LLC ({$rxnowInvoice->formatted_total})");
        $this->command->info("✓ Created invoice {$docOnlineInvoice->invoice_number} for DocOnline Health India ({$docOnlineInvoice->formatted_total})");
        $this->command->info("✓ Created estimate {$krishnaEstimate->invoice_number} for Krishna Institute ({$krishnaEstimate->formatted_total})");
        $this->command->info('Sample invoices and estimates created successfully!');
    }

    /**
     * Create a document and its line items, then derive the header totals from
     * those items so the two can never drift apart. Safe to re-run: documents
     * are matched on their organization, number and type.
     *
     * @param  array<string, mixed>  $attributes
     * @param  array<int, array{description: string, quantity: int, unit_price: int, tax_rate: int}>  $items
     */
    private function createDocument(Organization $organization, Customer $customer, array $attributes, array $items): Invoice
    {
        $invoice = Invoice::firstOrCreate(
            [
                'organization_id' => $organization->id,
                'invoice_number' => $attributes['invoice_number'],
                'type' => $attributes['type'],
            ],
            [
                ...$attributes,
                'organization_location_id' => $organization->primary_location_id,
                'customer_id' => $customer->id,
                'customer_location_id' => $customer->primary_location_id,
                'customer_shipping_location_id' => $customer->primary_location_id,
                'subtotal' => 0,
                'tax' => 0,
                'total' => 0,
            ]
        );

        if ($invoice->items()->doesntExist()) {
            $invoice->items()->createMany($items);
        }

        $this->calculator->recalculateInvoice($invoice)->save();

        return $invoice;
    }
}
