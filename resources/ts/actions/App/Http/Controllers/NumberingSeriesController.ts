import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\NumberingSeriesController::index
 * @see app/Http/Controllers/NumberingSeriesController.php:18
 * @route '/numbering-series'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/numbering-series',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\NumberingSeriesController::index
 * @see app/Http/Controllers/NumberingSeriesController.php:18
 * @route '/numbering-series'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NumberingSeriesController::index
 * @see app/Http/Controllers/NumberingSeriesController.php:18
 * @route '/numbering-series'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\NumberingSeriesController::index
 * @see app/Http/Controllers/NumberingSeriesController.php:18
 * @route '/numbering-series'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\NumberingSeriesController::store
 * @see app/Http/Controllers/NumberingSeriesController.php:40
 * @route '/numbering-series'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/numbering-series',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NumberingSeriesController::store
 * @see app/Http/Controllers/NumberingSeriesController.php:40
 * @route '/numbering-series'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NumberingSeriesController::store
 * @see app/Http/Controllers/NumberingSeriesController.php:40
 * @route '/numbering-series'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NumberingSeriesController::preview
 * @see app/Http/Controllers/NumberingSeriesController.php:139
 * @route '/numbering-series/preview'
 */
export const preview = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
});

preview.definition = {
    methods: ['post'],
    url: '/numbering-series/preview',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NumberingSeriesController::preview
 * @see app/Http/Controllers/NumberingSeriesController.php:139
 * @route '/numbering-series/preview'
 */
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NumberingSeriesController::preview
 * @see app/Http/Controllers/NumberingSeriesController.php:139
 * @route '/numbering-series/preview'
 */
preview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NumberingSeriesController::update
 * @see app/Http/Controllers/NumberingSeriesController.php:77
 * @route '/numbering-series/{series}'
 */
export const update = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/numbering-series/{series}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\NumberingSeriesController::update
 * @see app/Http/Controllers/NumberingSeriesController.php:77
 * @route '/numbering-series/{series}'
 */
update.url = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { series: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { series: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            series: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        series: typeof args.series === 'object' ? args.series.id : args.series,
    };

    return (
        update.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\NumberingSeriesController::update
 * @see app/Http/Controllers/NumberingSeriesController.php:77
 * @route '/numbering-series/{series}'
 */
update.put = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\NumberingSeriesController::destroy
 * @see app/Http/Controllers/NumberingSeriesController.php:103
 * @route '/numbering-series/{series}'
 */
export const destroy = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/numbering-series/{series}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\NumberingSeriesController::destroy
 * @see app/Http/Controllers/NumberingSeriesController.php:103
 * @route '/numbering-series/{series}'
 */
destroy.url = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { series: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { series: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            series: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        series: typeof args.series === 'object' ? args.series.id : args.series,
    };

    return (
        destroy.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\NumberingSeriesController::destroy
 * @see app/Http/Controllers/NumberingSeriesController.php:103
 * @route '/numbering-series/{series}'
 */
destroy.delete = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\NumberingSeriesController::toggleActive
 * @see app/Http/Controllers/NumberingSeriesController.php:116
 * @route '/numbering-series/{series}/toggle-active'
 */
export const toggleActive = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: toggleActive.url(args, options),
    method: 'post',
});

toggleActive.definition = {
    methods: ['post'],
    url: '/numbering-series/{series}/toggle-active',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NumberingSeriesController::toggleActive
 * @see app/Http/Controllers/NumberingSeriesController.php:116
 * @route '/numbering-series/{series}/toggle-active'
 */
toggleActive.url = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { series: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { series: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            series: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        series: typeof args.series === 'object' ? args.series.id : args.series,
    };

    return (
        toggleActive.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\NumberingSeriesController::toggleActive
 * @see app/Http/Controllers/NumberingSeriesController.php:116
 * @route '/numbering-series/{series}/toggle-active'
 */
toggleActive.post = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: toggleActive.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NumberingSeriesController::setDefault
 * @see app/Http/Controllers/NumberingSeriesController.php:127
 * @route '/numbering-series/{series}/set-default'
 */
export const setDefault = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: setDefault.url(args, options),
    method: 'post',
});

setDefault.definition = {
    methods: ['post'],
    url: '/numbering-series/{series}/set-default',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NumberingSeriesController::setDefault
 * @see app/Http/Controllers/NumberingSeriesController.php:127
 * @route '/numbering-series/{series}/set-default'
 */
setDefault.url = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { series: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { series: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            series: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        series: typeof args.series === 'object' ? args.series.id : args.series,
    };

    return (
        setDefault.definition.url
            .replace('{series}', parsedArgs.series.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\NumberingSeriesController::setDefault
 * @see app/Http/Controllers/NumberingSeriesController.php:127
 * @route '/numbering-series/{series}/set-default'
 */
setDefault.post = (
    args:
        | { series: number | { id: number } }
        | [series: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: setDefault.url(args, options),
    method: 'post',
});

const NumberingSeriesController = {
    index,
    store,
    preview,
    update,
    destroy,
    toggleActive,
    setDefault,
};

export default NumberingSeriesController;
