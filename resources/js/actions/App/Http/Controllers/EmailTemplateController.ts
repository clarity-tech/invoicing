import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmailTemplateController::index
* @see app/Http/Controllers/EmailTemplateController.php:20
* @route '/email-templates'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/email-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmailTemplateController::index
* @see app/Http/Controllers/EmailTemplateController.php:20
* @route '/email-templates'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailTemplateController::index
* @see app/Http/Controllers/EmailTemplateController.php:20
* @route '/email-templates'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::index
* @see app/Http/Controllers/EmailTemplateController.php:20
* @route '/email-templates'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::index
* @see app/Http/Controllers/EmailTemplateController.php:20
* @route '/email-templates'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::index
* @see app/Http/Controllers/EmailTemplateController.php:20
* @route '/email-templates'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::index
* @see app/Http/Controllers/EmailTemplateController.php:20
* @route '/email-templates'
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
* @see \App\Http\Controllers\EmailTemplateController::edit
* @see app/Http/Controllers/EmailTemplateController.php:31
* @route '/email-templates/{type}'
*/
export const edit = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/email-templates/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmailTemplateController::edit
* @see app/Http/Controllers/EmailTemplateController.php:31
* @route '/email-templates/{type}'
*/
edit.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    if (Array.isArray(args)) {
        args = {
            type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        type: args.type,
    }

    return edit.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailTemplateController::edit
* @see app/Http/Controllers/EmailTemplateController.php:31
* @route '/email-templates/{type}'
*/
edit.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::edit
* @see app/Http/Controllers/EmailTemplateController.php:31
* @route '/email-templates/{type}'
*/
edit.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::edit
* @see app/Http/Controllers/EmailTemplateController.php:31
* @route '/email-templates/{type}'
*/
const editForm = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::edit
* @see app/Http/Controllers/EmailTemplateController.php:31
* @route '/email-templates/{type}'
*/
editForm.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::edit
* @see app/Http/Controllers/EmailTemplateController.php:31
* @route '/email-templates/{type}'
*/
editForm.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmailTemplateController::update
* @see app/Http/Controllers/EmailTemplateController.php:49
* @route '/email-templates/{type}'
*/
export const update = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/email-templates/{type}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmailTemplateController::update
* @see app/Http/Controllers/EmailTemplateController.php:49
* @route '/email-templates/{type}'
*/
update.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    if (Array.isArray(args)) {
        args = {
            type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        type: args.type,
    }

    return update.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailTemplateController::update
* @see app/Http/Controllers/EmailTemplateController.php:49
* @route '/email-templates/{type}'
*/
update.put = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::update
* @see app/Http/Controllers/EmailTemplateController.php:49
* @route '/email-templates/{type}'
*/
const updateForm = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::update
* @see app/Http/Controllers/EmailTemplateController.php:49
* @route '/email-templates/{type}'
*/
updateForm.put = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmailTemplateController::destroy
* @see app/Http/Controllers/EmailTemplateController.php:64
* @route '/email-templates/{type}'
*/
export const destroy = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/email-templates/{type}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmailTemplateController::destroy
* @see app/Http/Controllers/EmailTemplateController.php:64
* @route '/email-templates/{type}'
*/
destroy.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    if (Array.isArray(args)) {
        args = {
            type: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        type: args.type,
    }

    return destroy.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailTemplateController::destroy
* @see app/Http/Controllers/EmailTemplateController.php:64
* @route '/email-templates/{type}'
*/
destroy.delete = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::destroy
* @see app/Http/Controllers/EmailTemplateController.php:64
* @route '/email-templates/{type}'
*/
const destroyForm = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::destroy
* @see app/Http/Controllers/EmailTemplateController.php:64
* @route '/email-templates/{type}'
*/
destroyForm.delete = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmailTemplateController::resolve
* @see app/Http/Controllers/EmailTemplateController.php:77
* @route '/api/email-templates/resolve'
*/
export const resolve = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resolve.url(options),
    method: 'get',
})

resolve.definition = {
    methods: ["get","head"],
    url: '/api/email-templates/resolve',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmailTemplateController::resolve
* @see app/Http/Controllers/EmailTemplateController.php:77
* @route '/api/email-templates/resolve'
*/
resolve.url = (options?: RouteQueryOptions) => {
    return resolve.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailTemplateController::resolve
* @see app/Http/Controllers/EmailTemplateController.php:77
* @route '/api/email-templates/resolve'
*/
resolve.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resolve.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::resolve
* @see app/Http/Controllers/EmailTemplateController.php:77
* @route '/api/email-templates/resolve'
*/
resolve.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resolve.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::resolve
* @see app/Http/Controllers/EmailTemplateController.php:77
* @route '/api/email-templates/resolve'
*/
const resolveForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: resolve.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::resolve
* @see app/Http/Controllers/EmailTemplateController.php:77
* @route '/api/email-templates/resolve'
*/
resolveForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: resolve.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::resolve
* @see app/Http/Controllers/EmailTemplateController.php:77
* @route '/api/email-templates/resolve'
*/
resolveForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: resolve.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

resolve.form = resolveForm

/**
* @see \App\Http\Controllers\EmailTemplateController::preview
* @see app/Http/Controllers/EmailTemplateController.php:97
* @route '/api/email-templates/preview'
*/
export const preview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

preview.definition = {
    methods: ["post"],
    url: '/api/email-templates/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmailTemplateController::preview
* @see app/Http/Controllers/EmailTemplateController.php:97
* @route '/api/email-templates/preview'
*/
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmailTemplateController::preview
* @see app/Http/Controllers/EmailTemplateController.php:97
* @route '/api/email-templates/preview'
*/
preview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::preview
* @see app/Http/Controllers/EmailTemplateController.php:97
* @route '/api/email-templates/preview'
*/
const previewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: preview.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmailTemplateController::preview
* @see app/Http/Controllers/EmailTemplateController.php:97
* @route '/api/email-templates/preview'
*/
previewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: preview.url(options),
    method: 'post',
})

preview.form = previewForm

const EmailTemplateController = { index, edit, update, destroy, resolve, preview }

export default EmailTemplateController