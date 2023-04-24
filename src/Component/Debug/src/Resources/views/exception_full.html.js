const _message = __jymfony.sprintf('%s (%d %s)', exceptionMessage, statusCode, statusText);

emit(`<!-- ${_message} -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${_message}</title>
        <link rel="icon" type="image/png" href="${include('assets/images/favicon.png.base64')}">
        <style>${include('assets/css/exception.css')}</style>
        <style>${include('assets/css/exception_full.css')}</style>
    </head>
    <body>
        <script>
            document.body.classList.add(
                localStorage.getItem('jymfony/profiler/theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'theme-dark' : 'theme-light')
            );
        </script>
`);

if (ReflectionClass.exists('Jymfony.Component.Kernel.Kernel')) {
    emit(`
            <header>
                <div class="container">
                    <h1 class="logo">${include('assets/images/jymfony-logo.svg')} Jymfony Exception</h1>

                    <div class="help-link">
                        <a href="https://jymfony.com/doc/${Jymfony.Component.Kernel.Kernel.VERSION}/index.html">
                            <span class="icon">${include('assets/images/icon-book.svg')}</span>
                            <span class="hidden-xs-down">Jymfony</span> Docs
                        </a>
                    </div>

                    <div class="help-link">
                        <a href="https://jymfony.com/support">
                            <span class="icon">${include('assets/images/icon-support.svg')}</span>
                            <span class="hidden-xs-down">Jymfony</span> Support
                        </a>
                    </div>
                </div>
            </header>
`);
}

emit(`
        ${include('views/exception.html.js', context)}

        <script type="module">
            ${include('assets/js/exception.mjs')}
        </script>
    </body>
</html>
<!-- ${_message} -->
`);
