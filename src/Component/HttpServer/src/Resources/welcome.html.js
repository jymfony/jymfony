module.exports = (version, baseDir) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>Welcome!</title>
    <style>
        body { background: #F5F5F5; font: 18px/1.5 sans-serif; }
        h1, h2 { line-height: 1.2; margin: 0 0 .5em; }
        h1 { font-size: 26px; }
        h2 { font-size: 21px; margin-bottom: 1em; }
        p { margin: 0 0 1em 0; }
        a { color: #0000F0; }
        a:hover { text-decoration: none; }
        code { background: #F5F5F5; max-width: 100px; padding: 2px 6px; word-wrap: break-word; }
        #wrapper { background: #FFF; margin: 1em auto; max-width: 800px; width: 95%; }
        #container { padding: 2em; }
        #welcome, #status { margin-bottom: 2em; }
        #comment { font-size: 14px; text-align: center; color: #777777; background: #FEFFEA; padding: 10px; }
        #comment p { margin-bottom: 0; }
        #icon-status, #icon-book { float: left; height: 64px; margin-right: 1em; margin-top: -4px; width: 64px; }
        #icon-book { display: none; }

        @media (min-width: 768px) {
            #wrapper { width: 80%; margin: 2em auto; }
            #icon-book { display: inline-block; }
            #status a, #next a { display: block; }
        }
    </style>
</head>
<body>
<div id="wrapper">
    <div id="container">
        <p align="center">
            <img src="https://s3.amazonaws.com/jymfony.com/jymfony-logo.svg" height="150">
        </p>
        <div id="welcome">
            <h1>Welcome to Jymfony ${version}</h1>
        </div>

        <div id="status">
            <p>
                <svg id="icon-status" width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z" fill="#759E1A"/></svg>

                Your application is now ready. You can start working on it at:<br>
                <code>${baseDir}</code>
            </p>
        </div>
    </div>
    <div id="comment">
        <p>
            You're seeing this page because debug mode is enabled and you haven't configured any homepage URL.
        </p>
    </div>
</div>
</body>
</html>`;
