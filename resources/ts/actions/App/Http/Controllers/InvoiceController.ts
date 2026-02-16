import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:29
* @route '/invoices'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:29
* @route '/invoices'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:29
* @route '/invoices'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:29
* @route '/invoices'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::destroy
* @see app/Http/Controllers/InvoiceController.php:410
* @route '/invoices/{invoice}'
*/
export const destroy = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/invoices/{invoice}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\InvoiceController::destroy
* @see app/Http/Controllers/InvoiceController.php:410
* @route '/invoices/{invoice}'
*/
destroy.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return destroy.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::destroy
* @see app/Http/Controllers/InvoiceController.php:410
* @route '/invoices/{invoice}'
*/
destroy.delete = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\InvoiceController::duplicate
* @see app/Http/Controllers/InvoiceController.php:422
* @route '/invoices/{invoice}/duplicate'
*/
export const duplicate = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicate.url(args, options),
    method: 'post',
})

duplicate.definition = {
    methods: ["post"],
    url: '/invoices/{invoice}/duplicate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvoiceController::duplicate
* @see app/Http/Controllers/InvoiceController.php:422
* @route '/invoices/{invoice}/duplicate'
*/
duplicate.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return duplicate.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::duplicate
* @see app/Http/Controllers/InvoiceController.php:422
* @route '/invoices/{invoice}/duplicate'
*/
duplicate.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::convertEstimate
* @see app/Http/Controllers/InvoiceController.php:461
* @route '/invoices/{invoice}/convert'
*/
export const convertEstimate = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertEstimate.url(args, options),
    method: 'post',
})

convertEstimate.definition = {
    methods: ["post"],
    url: '/invoices/{invoice}/convert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvoiceController::convertEstimate
* @see app/Http/Controllers/InvoiceController.php:461
* @route '/invoices/{invoice}/convert'
*/
convertEstimate.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return convertEstimate.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::convertEstimate
* @see app/Http/Controllers/InvoiceController.php:461
* @route '/invoices/{invoice}/convert'
*/
convertEstimate.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertEstimate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:475
* @route '/invoices/{invoice}/download'
*/
export const downloadPdf = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

downloadPdf.definition = {
    methods: ["get","head"],
    url: '/invoices/{invoice}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:475
* @route '/invoices/{invoice}/download'
*/
downloadPdf.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return downloadPdf.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:475
* @route '/invoices/{invoice}/download'
*/
downloadPdf.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:475
* @route '/invoices/{invoice}/download'
*/
downloadPdf.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:57
* @route '/invoices/create'
*/
const createf0d8bb0e7372996582e8da57d97dfde6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createf0d8bb0e7372996582e8da57d97dfde6.url(options),
    method: 'get',
})

createf0d8bb0e7372996582e8da57d97dfde6.definition = {
    methods: ["get","head"],
    url: '/invoices/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:57
* @route '/invoices/create'
*/
createf0d8bb0e7372996582e8da57d97dfde6.url = (options?: RouteQueryOptions) => {
    return createf0d8bb0e7372996582e8da57d97dfde6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:57
* @route '/invoices/create'
*/
createf0d8bb0e7372996582e8da57d97dfde6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createf0d8bb0e7372996582e8da57d97dfde6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:57
* @route '/invoices/create'
*/
createf0d8bb0e7372996582e8da57d97dfde6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createf0d8bb0e7372996582e8da57d97dfde6.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:57
* @route '/estimates/create'
*/
const create86952bc75e184b051d07e718195dc9e8 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create86952bc75e184b051d07e718195dc9e8.url(options),
    method: 'get',
})

create86952bc75e184b051d07e718195dc9e8.definition = {
    methods: ["get","head"],
    url: '/estimates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:57
* @route '/estimates/create'
*/
create86952bc75e184b051d07e718195dc9e8.url = (options?: RouteQueryOptions) => {
    return create86952bc75e184b051d07e718195dc9e8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:57
* @route '/estimates/create'
*/
create86952bc75e184b051d07e718195dc9e8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create86952bc75e184b051d07e718195dc9e8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:57
* @route '/estimates/create'
*/
create86952bc75e184b051d07e718195dc9e8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create86952bc75e184b051d07e718195dc9e8.url(options),
    method: 'head',
})

export const create = {
    '/invoices/create': createf0d8bb0e7372996582e8da57d97dfde6,
    '/estimates/create': create86952bc75e184b051d07e718195dc9e8,
}

/**
* @see \App\Http\Controllers\InvoiceController::store
* @see app/Http/Controllers/InvoiceController.php:104
* @route '/invoices'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/invoices',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvoiceController::store
* @see app/Http/Controllers/InvoiceController.php:104
* @route '/invoices'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::store
* @see app/Http/Controllers/InvoiceController.php:104
* @route '/invoices'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:237
* @route '/invoices/{invoice}/edit'
*/
export const edit = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/invoices/{invoice}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:237
* @route '/invoices/{invoice}/edit'
*/
edit.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return edit.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:237
* @route '/invoices/{invoice}/edit'
*/
edit.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:237
* @route '/invoices/{invoice}/edit'
*/
edit.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::update
* @see app/Http/Controllers/InvoiceController.php:272
* @route '/invoices/{invoice}'
*/
export const update = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/invoices/{invoice}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\InvoiceController::update
* @see app/Http/Controllers/InvoiceController.php:272
* @route '/invoices/{invoice}'
*/
update.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return update.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::update
* @see app/Http/Controllers/InvoiceController.php:272
* @route '/invoices/{invoice}'
*/
update.put = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\InvoiceController::sendEmail
* @see app/Http/Controllers/InvoiceController.php:362
* @route '/invoices/{invoice}/send-email'
*/
export const sendEmail = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendEmail.url(args, options),
    method: 'post',
})

sendEmail.definition = {
    methods: ["post"],
    url: '/invoices/{invoice}/send-email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvoiceController::sendEmail
* @see app/Http/Controllers/InvoiceController.php:362
* @route '/invoices/{invoice}/send-email'
*/
sendEmail.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
    }

    return sendEmail.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::sendEmail
* @see app/Http/Controllers/InvoiceController.php:362
* @route '/invoices/{invoice}/send-email'
*/
sendEmail.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendEmail.url(args, options),
    method: 'post',
})

const InvoiceController = { index, destroy, duplicate, convertEstimate, downloadPdf, create, store, edit, update, sendEmail }

export default InvoiceController