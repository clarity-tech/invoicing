import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organizations'
 */
const indexad2d50927afb82b1bbcf18f4dc6d241d = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: indexad2d50927afb82b1bbcf18f4dc6d241d.url(options),
    method: 'get',
});

indexad2d50927afb82b1bbcf18f4dc6d241d.definition = {
    methods: ['get', 'head'],
    url: '/organizations',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organizations'
 */
indexad2d50927afb82b1bbcf18f4dc6d241d.url = (options?: RouteQueryOptions) => {
    return (
        indexad2d50927afb82b1bbcf18f4dc6d241d.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organizations'
 */
indexad2d50927afb82b1bbcf18f4dc6d241d.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: indexad2d50927afb82b1bbcf18f4dc6d241d.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organizations'
 */
indexad2d50927afb82b1bbcf18f4dc6d241d.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: indexad2d50927afb82b1bbcf18f4dc6d241d.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organization/edit'
 */
const indexd0194c890723e45fdc2af8f78eb52360 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: indexd0194c890723e45fdc2af8f78eb52360.url(options),
    method: 'get',
});

indexd0194c890723e45fdc2af8f78eb52360.definition = {
    methods: ['get', 'head'],
    url: '/organization/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organization/edit'
 */
indexd0194c890723e45fdc2af8f78eb52360.url = (options?: RouteQueryOptions) => {
    return (
        indexd0194c890723e45fdc2af8f78eb52360.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organization/edit'
 */
indexd0194c890723e45fdc2af8f78eb52360.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: indexd0194c890723e45fdc2af8f78eb52360.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:22
 * @route '/organization/edit'
 */
indexd0194c890723e45fdc2af8f78eb52360.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: indexd0194c890723e45fdc2af8f78eb52360.url(options),
    method: 'head',
});

export const index = {
    '/organizations': indexad2d50927afb82b1bbcf18f4dc6d241d,
    '/organization/edit': indexd0194c890723e45fdc2af8f78eb52360,
};

/**
 * @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:52
 * @route '/organizations/{organization}'
 */
export const update = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/organizations/{organization}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:52
 * @route '/organizations/{organization}'
 */
update.url = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        organization:
            typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
    };

    return (
        update.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:52
 * @route '/organizations/{organization}'
 */
update.put = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\OrganizationController::updateLocation
 * @see app/Http/Controllers/OrganizationController.php:104
 * @route '/organizations/{organization}/location'
 */
export const updateLocation = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: updateLocation.url(args, options),
    method: 'put',
});

updateLocation.definition = {
    methods: ['put'],
    url: '/organizations/{organization}/location',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\OrganizationController::updateLocation
 * @see app/Http/Controllers/OrganizationController.php:104
 * @route '/organizations/{organization}/location'
 */
updateLocation.url = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        organization:
            typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
    };

    return (
        updateLocation.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationController::updateLocation
 * @see app/Http/Controllers/OrganizationController.php:104
 * @route '/organizations/{organization}/location'
 */
updateLocation.put = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: updateLocation.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\OrganizationController::updateBankDetails
 * @see app/Http/Controllers/OrganizationController.php:143
 * @route '/organizations/{organization}/bank-details'
 */
export const updateBankDetails = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: updateBankDetails.url(args, options),
    method: 'put',
});

updateBankDetails.definition = {
    methods: ['put'],
    url: '/organizations/{organization}/bank-details',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\OrganizationController::updateBankDetails
 * @see app/Http/Controllers/OrganizationController.php:143
 * @route '/organizations/{organization}/bank-details'
 */
updateBankDetails.url = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        organization:
            typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
    };

    return (
        updateBankDetails.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationController::updateBankDetails
 * @see app/Http/Controllers/OrganizationController.php:143
 * @route '/organizations/{organization}/bank-details'
 */
updateBankDetails.put = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: updateBankDetails.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\OrganizationController::uploadLogo
 * @see app/Http/Controllers/OrganizationController.php:172
 * @route '/organizations/{organization}/logo'
 */
export const uploadLogo = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: uploadLogo.url(args, options),
    method: 'post',
});

uploadLogo.definition = {
    methods: ['post'],
    url: '/organizations/{organization}/logo',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\OrganizationController::uploadLogo
 * @see app/Http/Controllers/OrganizationController.php:172
 * @route '/organizations/{organization}/logo'
 */
uploadLogo.url = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        organization:
            typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
    };

    return (
        uploadLogo.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationController::uploadLogo
 * @see app/Http/Controllers/OrganizationController.php:172
 * @route '/organizations/{organization}/logo'
 */
uploadLogo.post = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: uploadLogo.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OrganizationController::removeLogo
 * @see app/Http/Controllers/OrganizationController.php:186
 * @route '/organizations/{organization}/logo'
 */
export const removeLogo = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: removeLogo.url(args, options),
    method: 'delete',
});

removeLogo.definition = {
    methods: ['delete'],
    url: '/organizations/{organization}/logo',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\OrganizationController::removeLogo
 * @see app/Http/Controllers/OrganizationController.php:186
 * @route '/organizations/{organization}/logo'
 */
removeLogo.url = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        organization:
            typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
    };

    return (
        removeLogo.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationController::removeLogo
 * @see app/Http/Controllers/OrganizationController.php:186
 * @route '/organizations/{organization}/logo'
 */
removeLogo.delete = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: removeLogo.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:195
 * @route '/organizations/{organization}'
 */
export const destroy = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/organizations/{organization}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:195
 * @route '/organizations/{organization}'
 */
destroy.url = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { organization: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            organization: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        organization:
            typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
    };

    return (
        destroy.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:195
 * @route '/organizations/{organization}'
 */
destroy.delete = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

const OrganizationController = {
    index,
    update,
    updateLocation,
    updateBankDetails,
    uploadLogo,
    removeLogo,
    destroy,
};

export default OrganizationController;
