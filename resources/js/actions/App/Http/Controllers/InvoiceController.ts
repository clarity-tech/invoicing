import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:30
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
* @see app/Http/Controllers/InvoiceController.php:30
* @route '/invoices'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:30
* @route '/invoices'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:30
* @route '/invoices'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:30
* @route '/invoices'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:30
* @route '/invoices'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::index
* @see app/Http/Controllers/InvoiceController.php:30
* @route '/invoices'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\InvoiceController::destroy
* @see app/Http/Controllers/InvoiceController.php:408
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
* @see app/Http/Controllers/InvoiceController.php:408
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
* @see app/Http/Controllers/InvoiceController.php:408
* @route '/invoices/{invoice}'
*/
destroy.delete = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\InvoiceController::destroy
* @see app/Http/Controllers/InvoiceController.php:408
* @route '/invoices/{invoice}'
*/
const destroyForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::destroy
* @see app/Http/Controllers/InvoiceController.php:408
* @route '/invoices/{invoice}'
*/
destroyForm.delete = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\InvoiceController::duplicate
* @see app/Http/Controllers/InvoiceController.php:420
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
* @see app/Http/Controllers/InvoiceController.php:420
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
* @see app/Http/Controllers/InvoiceController.php:420
* @route '/invoices/{invoice}/duplicate'
*/
duplicate.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: duplicate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::duplicate
* @see app/Http/Controllers/InvoiceController.php:420
* @route '/invoices/{invoice}/duplicate'
*/
const duplicateForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: duplicate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::duplicate
* @see app/Http/Controllers/InvoiceController.php:420
* @route '/invoices/{invoice}/duplicate'
*/
duplicateForm.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: duplicate.url(args, options),
    method: 'post',
})

duplicate.form = duplicateForm

/**
* @see \App\Http\Controllers\InvoiceController::convertEstimate
* @see app/Http/Controllers/InvoiceController.php:459
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
* @see app/Http/Controllers/InvoiceController.php:459
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
* @see app/Http/Controllers/InvoiceController.php:459
* @route '/invoices/{invoice}/convert'
*/
convertEstimate.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertEstimate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::convertEstimate
* @see app/Http/Controllers/InvoiceController.php:459
* @route '/invoices/{invoice}/convert'
*/
const convertEstimateForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convertEstimate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::convertEstimate
* @see app/Http/Controllers/InvoiceController.php:459
* @route '/invoices/{invoice}/convert'
*/
convertEstimateForm.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convertEstimate.url(args, options),
    method: 'post',
})

convertEstimate.form = convertEstimateForm

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:473
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
* @see app/Http/Controllers/InvoiceController.php:473
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
* @see app/Http/Controllers/InvoiceController.php:473
* @route '/invoices/{invoice}/download'
*/
downloadPdf.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:473
* @route '/invoices/{invoice}/download'
*/
downloadPdf.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:473
* @route '/invoices/{invoice}/download'
*/
const downloadPdfForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:473
* @route '/invoices/{invoice}/download'
*/
downloadPdfForm.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::downloadPdf
* @see app/Http/Controllers/InvoiceController.php:473
* @route '/invoices/{invoice}/download'
*/
downloadPdfForm.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadPdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadPdf.form = downloadPdfForm

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
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
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/invoices/create'
*/
createf0d8bb0e7372996582e8da57d97dfde6.url = (options?: RouteQueryOptions) => {
    return createf0d8bb0e7372996582e8da57d97dfde6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/invoices/create'
*/
createf0d8bb0e7372996582e8da57d97dfde6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createf0d8bb0e7372996582e8da57d97dfde6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/invoices/create'
*/
createf0d8bb0e7372996582e8da57d97dfde6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createf0d8bb0e7372996582e8da57d97dfde6.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/invoices/create'
*/
const createf0d8bb0e7372996582e8da57d97dfde6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createf0d8bb0e7372996582e8da57d97dfde6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/invoices/create'
*/
createf0d8bb0e7372996582e8da57d97dfde6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createf0d8bb0e7372996582e8da57d97dfde6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/invoices/create'
*/
createf0d8bb0e7372996582e8da57d97dfde6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: createf0d8bb0e7372996582e8da57d97dfde6.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

createf0d8bb0e7372996582e8da57d97dfde6.form = createf0d8bb0e7372996582e8da57d97dfde6Form
/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
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
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/estimates/create'
*/
create86952bc75e184b051d07e718195dc9e8.url = (options?: RouteQueryOptions) => {
    return create86952bc75e184b051d07e718195dc9e8.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/estimates/create'
*/
create86952bc75e184b051d07e718195dc9e8.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create86952bc75e184b051d07e718195dc9e8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/estimates/create'
*/
create86952bc75e184b051d07e718195dc9e8.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create86952bc75e184b051d07e718195dc9e8.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/estimates/create'
*/
const create86952bc75e184b051d07e718195dc9e8Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create86952bc75e184b051d07e718195dc9e8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/estimates/create'
*/
create86952bc75e184b051d07e718195dc9e8Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create86952bc75e184b051d07e718195dc9e8.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::create
* @see app/Http/Controllers/InvoiceController.php:58
* @route '/estimates/create'
*/
create86952bc75e184b051d07e718195dc9e8Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create86952bc75e184b051d07e718195dc9e8.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create86952bc75e184b051d07e718195dc9e8.form = create86952bc75e184b051d07e718195dc9e8Form

export const create = {
    '/invoices/create': createf0d8bb0e7372996582e8da57d97dfde6,
    '/estimates/create': create86952bc75e184b051d07e718195dc9e8,
}

/**
* @see \App\Http\Controllers\InvoiceController::store
* @see app/Http/Controllers/InvoiceController.php:105
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
* @see app/Http/Controllers/InvoiceController.php:105
* @route '/invoices'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::store
* @see app/Http/Controllers/InvoiceController.php:105
* @route '/invoices'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::store
* @see app/Http/Controllers/InvoiceController.php:105
* @route '/invoices'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::store
* @see app/Http/Controllers/InvoiceController.php:105
* @route '/invoices'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:235
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
* @see app/Http/Controllers/InvoiceController.php:235
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
* @see app/Http/Controllers/InvoiceController.php:235
* @route '/invoices/{invoice}/edit'
*/
edit.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:235
* @route '/invoices/{invoice}/edit'
*/
edit.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:235
* @route '/invoices/{invoice}/edit'
*/
const editForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:235
* @route '/invoices/{invoice}/edit'
*/
editForm.get = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvoiceController::edit
* @see app/Http/Controllers/InvoiceController.php:235
* @route '/invoices/{invoice}/edit'
*/
editForm.head = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\InvoiceController::update
* @see app/Http/Controllers/InvoiceController.php:270
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
* @see app/Http/Controllers/InvoiceController.php:270
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
* @see app/Http/Controllers/InvoiceController.php:270
* @route '/invoices/{invoice}'
*/
update.put = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\InvoiceController::update
* @see app/Http/Controllers/InvoiceController.php:270
* @route '/invoices/{invoice}'
*/
const updateForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::update
* @see app/Http/Controllers/InvoiceController.php:270
* @route '/invoices/{invoice}'
*/
updateForm.put = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\InvoiceController::sendEmail
* @see app/Http/Controllers/InvoiceController.php:360
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
* @see app/Http/Controllers/InvoiceController.php:360
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
* @see app/Http/Controllers/InvoiceController.php:360
* @route '/invoices/{invoice}/send-email'
*/
sendEmail.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendEmail.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::sendEmail
* @see app/Http/Controllers/InvoiceController.php:360
* @route '/invoices/{invoice}/send-email'
*/
const sendEmailForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendEmail.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::sendEmail
* @see app/Http/Controllers/InvoiceController.php:360
* @route '/invoices/{invoice}/send-email'
*/
sendEmailForm.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sendEmail.url(args, options),
    method: 'post',
})

sendEmail.form = sendEmailForm

/**
* @see \App\Http\Controllers\InvoiceController::recordPayment
* @see app/Http/Controllers/InvoiceController.php:484
* @route '/invoices/{invoice}/payments'
*/
export const recordPayment = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordPayment.url(args, options),
    method: 'post',
})

recordPayment.definition = {
    methods: ["post"],
    url: '/invoices/{invoice}/payments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvoiceController::recordPayment
* @see app/Http/Controllers/InvoiceController.php:484
* @route '/invoices/{invoice}/payments'
*/
recordPayment.url = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return recordPayment.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::recordPayment
* @see app/Http/Controllers/InvoiceController.php:484
* @route '/invoices/{invoice}/payments'
*/
recordPayment.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recordPayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::recordPayment
* @see app/Http/Controllers/InvoiceController.php:484
* @route '/invoices/{invoice}/payments'
*/
const recordPaymentForm = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: recordPayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::recordPayment
* @see app/Http/Controllers/InvoiceController.php:484
* @route '/invoices/{invoice}/payments'
*/
recordPaymentForm.post = (args: { invoice: number | { id: number } } | [invoice: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: recordPayment.url(args, options),
    method: 'post',
})

recordPayment.form = recordPaymentForm

/**
* @see \App\Http\Controllers\InvoiceController::deletePayment
* @see app/Http/Controllers/InvoiceController.php:512
* @route '/invoices/{invoice}/payments/{payment}'
*/
export const deletePayment = (args: { invoice: number | { id: number }, payment: number | { id: number } } | [invoice: number | { id: number }, payment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deletePayment.url(args, options),
    method: 'delete',
})

deletePayment.definition = {
    methods: ["delete"],
    url: '/invoices/{invoice}/payments/{payment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\InvoiceController::deletePayment
* @see app/Http/Controllers/InvoiceController.php:512
* @route '/invoices/{invoice}/payments/{payment}'
*/
deletePayment.url = (args: { invoice: number | { id: number }, payment: number | { id: number } } | [invoice: number | { id: number }, payment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
            payment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        invoice: typeof args.invoice === 'object'
        ? args.invoice.id
        : args.invoice,
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return deletePayment.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvoiceController::deletePayment
* @see app/Http/Controllers/InvoiceController.php:512
* @route '/invoices/{invoice}/payments/{payment}'
*/
deletePayment.delete = (args: { invoice: number | { id: number }, payment: number | { id: number } } | [invoice: number | { id: number }, payment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deletePayment.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\InvoiceController::deletePayment
* @see app/Http/Controllers/InvoiceController.php:512
* @route '/invoices/{invoice}/payments/{payment}'
*/
const deletePaymentForm = (args: { invoice: number | { id: number }, payment: number | { id: number } } | [invoice: number | { id: number }, payment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deletePayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvoiceController::deletePayment
* @see app/Http/Controllers/InvoiceController.php:512
* @route '/invoices/{invoice}/payments/{payment}'
*/
deletePaymentForm.delete = (args: { invoice: number | { id: number }, payment: number | { id: number } } | [invoice: number | { id: number }, payment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deletePayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deletePayment.form = deletePaymentForm

const InvoiceController = { index, destroy, duplicate, convertEstimate, downloadPdf, create, store, edit, update, sendEmail, recordPayment, deletePayment }

export default InvoiceController