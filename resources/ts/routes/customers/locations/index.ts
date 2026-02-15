import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:98
* @route '/customers/{customer}/locations'
*/
export const store = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customers/{customer}/locations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:98
* @route '/customers/{customer}/locations'
*/
store.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return store.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:98
* @route '/customers/{customer}/locations'
*/
store.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:134
* @route '/customers/{customer}/locations/{location}'
*/
export const update = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/customers/{customer}/locations/{location}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:134
* @route '/customers/{customer}/locations/{location}'
*/
update.url = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            customer: args[0],
            location: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
        location: typeof args.location === 'object'
        ? args.location.id
        : args.location,
    }

    return update.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:134
* @route '/customers/{customer}/locations/{location}'
*/
update.put = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CustomerController::destroy
* @see app/Http/Controllers/CustomerController.php:164
* @route '/customers/{customer}/locations/{location}'
*/
export const destroy = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customers/{customer}/locations/{location}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CustomerController::destroy
* @see app/Http/Controllers/CustomerController.php:164
* @route '/customers/{customer}/locations/{location}'
*/
destroy.url = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            customer: args[0],
            location: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
        location: typeof args.location === 'object'
        ? args.location.id
        : args.location,
    }

    return destroy.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::destroy
* @see app/Http/Controllers/CustomerController.php:164
* @route '/customers/{customer}/locations/{location}'
*/
destroy.delete = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const locations = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default locations