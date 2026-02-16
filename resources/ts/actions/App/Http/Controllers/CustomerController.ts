import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:22
* @route '/customers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:22
* @route '/customers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:22
* @route '/customers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:22
* @route '/customers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:37
* @route '/customers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:37
* @route '/customers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::store
* @see app/Http/Controllers/CustomerController.php:37
* @route '/customers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:58
* @route '/customers/{customer}'
*/
export const update = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/customers/{customer}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:58
* @route '/customers/{customer}'
*/
update.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:58
* @route '/customers/{customer}'
*/
update.put = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CustomerController::update
* @see app/Http/Controllers/CustomerController.php:58
* @route '/customers/{customer}'
*/
update.patch = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CustomerController::destroy
* @see app/Http/Controllers/CustomerController.php:78
* @route '/customers/{customer}'
*/
export const destroy = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customers/{customer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CustomerController::destroy
* @see app/Http/Controllers/CustomerController.php:78
* @route '/customers/{customer}'
*/
destroy.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::destroy
* @see app/Http/Controllers/CustomerController.php:78
* @route '/customers/{customer}'
*/
destroy.delete = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CustomerController::storeLocation
* @see app/Http/Controllers/CustomerController.php:98
* @route '/customers/{customer}/locations'
*/
export const storeLocation = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeLocation.url(args, options),
    method: 'post',
})

storeLocation.definition = {
    methods: ["post"],
    url: '/customers/{customer}/locations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerController::storeLocation
* @see app/Http/Controllers/CustomerController.php:98
* @route '/customers/{customer}/locations'
*/
storeLocation.url = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return storeLocation.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::storeLocation
* @see app/Http/Controllers/CustomerController.php:98
* @route '/customers/{customer}/locations'
*/
storeLocation.post = (args: { customer: number | { id: number } } | [customer: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeLocation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerController::updateLocation
* @see app/Http/Controllers/CustomerController.php:134
* @route '/customers/{customer}/locations/{location}'
*/
export const updateLocation = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLocation.url(args, options),
    method: 'put',
})

updateLocation.definition = {
    methods: ["put"],
    url: '/customers/{customer}/locations/{location}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CustomerController::updateLocation
* @see app/Http/Controllers/CustomerController.php:134
* @route '/customers/{customer}/locations/{location}'
*/
updateLocation.url = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return updateLocation.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::updateLocation
* @see app/Http/Controllers/CustomerController.php:134
* @route '/customers/{customer}/locations/{location}'
*/
updateLocation.put = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateLocation.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CustomerController::destroyLocation
* @see app/Http/Controllers/CustomerController.php:164
* @route '/customers/{customer}/locations/{location}'
*/
export const destroyLocation = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyLocation.url(args, options),
    method: 'delete',
})

destroyLocation.definition = {
    methods: ["delete"],
    url: '/customers/{customer}/locations/{location}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CustomerController::destroyLocation
* @see app/Http/Controllers/CustomerController.php:164
* @route '/customers/{customer}/locations/{location}'
*/
destroyLocation.url = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroyLocation.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::destroyLocation
* @see app/Http/Controllers/CustomerController.php:164
* @route '/customers/{customer}/locations/{location}'
*/
destroyLocation.delete = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyLocation.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CustomerController::setPrimaryLocation
* @see app/Http/Controllers/CustomerController.php:183
* @route '/customers/{customer}/primary-location/{location}'
*/
export const setPrimaryLocation = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setPrimaryLocation.url(args, options),
    method: 'post',
})

setPrimaryLocation.definition = {
    methods: ["post"],
    url: '/customers/{customer}/primary-location/{location}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerController::setPrimaryLocation
* @see app/Http/Controllers/CustomerController.php:183
* @route '/customers/{customer}/primary-location/{location}'
*/
setPrimaryLocation.url = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return setPrimaryLocation.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace('{location}', parsedArgs.location.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::setPrimaryLocation
* @see app/Http/Controllers/CustomerController.php:183
* @route '/customers/{customer}/primary-location/{location}'
*/
setPrimaryLocation.post = (args: { customer: number | { id: number }, location: number | { id: number } } | [customer: number | { id: number }, location: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setPrimaryLocation.url(args, options),
    method: 'post',
})

const CustomerController = { index, store, update, destroy, storeLocation, updateLocation, destroyLocation, setPrimaryLocation }

export default CustomerController