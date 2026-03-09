import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    applyUrlDefaults,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\PublicViewController::publicMethod
 * @see app/Http/Controllers/PublicViewController.php:12
 * @route '/invoices/view/{ulid}'
 */
export const publicMethod = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
});

publicMethod.definition = {
    methods: ['get', 'head'],
    url: '/invoices/view/{ulid}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PublicViewController::publicMethod
 * @see app/Http/Controllers/PublicViewController.php:12
 * @route '/invoices/view/{ulid}'
 */
publicMethod.url = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ulid: args };
    }

    if (Array.isArray(args)) {
        args = {
            ulid: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        ulid: args.ulid,
    };

    return (
        publicMethod.definition.url
            .replace('{ulid}', parsedArgs.ulid.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PublicViewController::publicMethod
 * @see app/Http/Controllers/PublicViewController.php:12
 * @route '/invoices/view/{ulid}'
 */
publicMethod.get = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PublicViewController::publicMethod
 * @see app/Http/Controllers/PublicViewController.php:12
 * @route '/invoices/view/{ulid}'
 */
publicMethod.head = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: publicMethod.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PublicViewController::pdf
 * @see app/Http/Controllers/PublicViewController.php:34
 * @route '/invoices/{ulid}/pdf'
 */
export const pdf = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
});

pdf.definition = {
    methods: ['get', 'head'],
    url: '/invoices/{ulid}/pdf',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PublicViewController::pdf
 * @see app/Http/Controllers/PublicViewController.php:34
 * @route '/invoices/{ulid}/pdf'
 */
pdf.url = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ulid: args };
    }

    if (Array.isArray(args)) {
        args = {
            ulid: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        ulid: args.ulid,
    };

    return (
        pdf.definition.url
            .replace('{ulid}', parsedArgs.ulid.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PublicViewController::pdf
 * @see app/Http/Controllers/PublicViewController.php:34
 * @route '/invoices/{ulid}/pdf'
 */
pdf.get = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PublicViewController::pdf
 * @see app/Http/Controllers/PublicViewController.php:34
 * @route '/invoices/{ulid}/pdf'
 */
pdf.head = (
    args: { ulid: string | number } | [ulid: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:29
 * @route '/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/invoices',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:29
 * @route '/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:29
 * @route '/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\InvoiceController::index
 * @see app/Http/Controllers/InvoiceController.php:29
 * @route '/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\InvoiceController::destroy
 * @see app/Http/Controllers/InvoiceController.php:410
 * @route '/invoices/{invoice}'
 */
export const destroy = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/invoices/{invoice}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\InvoiceController::destroy
 * @see app/Http/Controllers/InvoiceController.php:410
 * @route '/invoices/{invoice}'
 */
destroy.url = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoice:
            typeof args.invoice === 'object' ? args.invoice.id : args.invoice,
    };

    return (
        destroy.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\InvoiceController::destroy
 * @see app/Http/Controllers/InvoiceController.php:410
 * @route '/invoices/{invoice}'
 */
destroy.delete = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\InvoiceController::duplicate
 * @see app/Http/Controllers/InvoiceController.php:422
 * @route '/invoices/{invoice}/duplicate'
 */
export const duplicate = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: duplicate.url(args, options),
    method: 'post',
});

duplicate.definition = {
    methods: ['post'],
    url: '/invoices/{invoice}/duplicate',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\InvoiceController::duplicate
 * @see app/Http/Controllers/InvoiceController.php:422
 * @route '/invoices/{invoice}/duplicate'
 */
duplicate.url = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoice:
            typeof args.invoice === 'object' ? args.invoice.id : args.invoice,
    };

    return (
        duplicate.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\InvoiceController::duplicate
 * @see app/Http/Controllers/InvoiceController.php:422
 * @route '/invoices/{invoice}/duplicate'
 */
duplicate.post = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: duplicate.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\InvoiceController::convert
 * @see app/Http/Controllers/InvoiceController.php:461
 * @route '/invoices/{invoice}/convert'
 */
export const convert = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: convert.url(args, options),
    method: 'post',
});

convert.definition = {
    methods: ['post'],
    url: '/invoices/{invoice}/convert',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\InvoiceController::convert
 * @see app/Http/Controllers/InvoiceController.php:461
 * @route '/invoices/{invoice}/convert'
 */
convert.url = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoice:
            typeof args.invoice === 'object' ? args.invoice.id : args.invoice,
    };

    return (
        convert.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\InvoiceController::convert
 * @see app/Http/Controllers/InvoiceController.php:461
 * @route '/invoices/{invoice}/convert'
 */
convert.post = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: convert.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:475
 * @route '/invoices/{invoice}/download'
 */
export const download = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
});

download.definition = {
    methods: ['get', 'head'],
    url: '/invoices/{invoice}/download',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:475
 * @route '/invoices/{invoice}/download'
 */
download.url = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoice:
            typeof args.invoice === 'object' ? args.invoice.id : args.invoice,
    };

    return (
        download.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:475
 * @route '/invoices/{invoice}/download'
 */
download.get = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\InvoiceController::download
 * @see app/Http/Controllers/InvoiceController.php:475
 * @route '/invoices/{invoice}/download'
 */
download.head = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\InvoiceController::create
 * @see app/Http/Controllers/InvoiceController.php:57
 * @route '/invoices/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/invoices/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\InvoiceController::create
 * @see app/Http/Controllers/InvoiceController.php:57
 * @route '/invoices/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\InvoiceController::create
 * @see app/Http/Controllers/InvoiceController.php:57
 * @route '/invoices/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\InvoiceController::create
 * @see app/Http/Controllers/InvoiceController.php:57
 * @route '/invoices/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\InvoiceController::store
 * @see app/Http/Controllers/InvoiceController.php:104
 * @route '/invoices'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/invoices',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\InvoiceController::store
 * @see app/Http/Controllers/InvoiceController.php:104
 * @route '/invoices'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\InvoiceController::store
 * @see app/Http/Controllers/InvoiceController.php:104
 * @route '/invoices'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\InvoiceController::edit
 * @see app/Http/Controllers/InvoiceController.php:237
 * @route '/invoices/{invoice}/edit'
 */
export const edit = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/invoices/{invoice}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\InvoiceController::edit
 * @see app/Http/Controllers/InvoiceController.php:237
 * @route '/invoices/{invoice}/edit'
 */
edit.url = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoice:
            typeof args.invoice === 'object' ? args.invoice.id : args.invoice,
    };

    return (
        edit.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\InvoiceController::edit
 * @see app/Http/Controllers/InvoiceController.php:237
 * @route '/invoices/{invoice}/edit'
 */
edit.get = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\InvoiceController::edit
 * @see app/Http/Controllers/InvoiceController.php:237
 * @route '/invoices/{invoice}/edit'
 */
edit.head = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\InvoiceController::update
 * @see app/Http/Controllers/InvoiceController.php:272
 * @route '/invoices/{invoice}'
 */
export const update = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/invoices/{invoice}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\InvoiceController::update
 * @see app/Http/Controllers/InvoiceController.php:272
 * @route '/invoices/{invoice}'
 */
update.url = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoice:
            typeof args.invoice === 'object' ? args.invoice.id : args.invoice,
    };

    return (
        update.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\InvoiceController::update
 * @see app/Http/Controllers/InvoiceController.php:272
 * @route '/invoices/{invoice}'
 */
update.put = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\InvoiceController::sendEmail
 * @see app/Http/Controllers/InvoiceController.php:362
 * @route '/invoices/{invoice}/send-email'
 */
export const sendEmail = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: sendEmail.url(args, options),
    method: 'post',
});

sendEmail.definition = {
    methods: ['post'],
    url: '/invoices/{invoice}/send-email',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\InvoiceController::sendEmail
 * @see app/Http/Controllers/InvoiceController.php:362
 * @route '/invoices/{invoice}/send-email'
 */
sendEmail.url = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { invoice: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { invoice: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            invoice: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        invoice:
            typeof args.invoice === 'object' ? args.invoice.id : args.invoice,
    };

    return (
        sendEmail.definition.url
            .replace('{invoice}', parsedArgs.invoice.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\InvoiceController::sendEmail
 * @see app/Http/Controllers/InvoiceController.php:362
 * @route '/invoices/{invoice}/send-email'
 */
sendEmail.post = (
    args:
        | { invoice: number | { id: number } }
        | [invoice: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: sendEmail.url(args, options),
    method: 'post',
});

const invoices = {
    public: Object.assign(publicMethod, publicMethod),
    pdf: Object.assign(pdf, pdf),
    index: Object.assign(index, index),
    destroy: Object.assign(destroy, destroy),
    duplicate: Object.assign(duplicate, duplicate),
    convert: Object.assign(convert, convert),
    download: Object.assign(download, download),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    sendEmail: Object.assign(sendEmail, sendEmail),
};

export default invoices;
