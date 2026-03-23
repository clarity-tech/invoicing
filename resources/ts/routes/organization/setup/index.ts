import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    applyUrlDefaults,
} from './../../../wayfinder';
/**
 * @see \App\Http\Controllers\OrganizationSetupController::saveStep
 * @see app/Http/Controllers/OrganizationSetupController.php:79
 * @route '/organization/setup/{organization}/step'
 */
export const saveStep = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: saveStep.url(args, options),
    method: 'post',
});

saveStep.definition = {
    methods: ['post'],
    url: '/organization/setup/{organization}/step',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\OrganizationSetupController::saveStep
 * @see app/Http/Controllers/OrganizationSetupController.php:79
 * @route '/organization/setup/{organization}/step'
 */
saveStep.url = (
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
        saveStep.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OrganizationSetupController::saveStep
 * @see app/Http/Controllers/OrganizationSetupController.php:79
 * @route '/organization/setup/{organization}/step'
 */
saveStep.post = (
    args:
        | { organization: number | { id: number } }
        | [organization: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: saveStep.url(args, options),
    method: 'post',
});

const setup = {
    saveStep: Object.assign(saveStep, saveStep),
};

export default setup;
