_jf_{{ COMMAND_NAME }}() {
    # Use newline as only separator to allow space in completion values
    IFS=$'\n'
    local jf_cmd="${COMP_WORDS[0]}"

    # for an alias, get the real script behind it
    jf_cmd_type=$(type -t $jf_cmd)
    if [[ $jf_cmd_type == "alias" ]]; then
        jf_cmd=$(alias $jf_cmd | sed -E "s/alias $jf_cmd='(.*)'/\1/")
    elif [[ $jf_cmd_type == "file" ]]; then
        jf_cmd=$(type -p $jf_cmd)
    fi

    if [[ $jf_cmd_type != "function" && ! -x $jf_cmd ]]; then
        return 1
    fi

    local cur prev words cword
    _get_comp_words_by_ref -n := cur prev words cword

    local completecmd=("$jf_cmd" "_complete" "-vvv" "--no-interaction" "-sbash" "-c$cword" "-j{{ VERSION }}")
    for w in ${words[@]}; do
        w=$(printf -- '%b' "$w")
        # remove quotes from typed values
        quote="${w:0:1}"
        if [ "$quote" == \' ]; then
            w="${w%\'}"
            w="${w#\'}"
        elif [ "$quote" == \" ]; then
            w="${w%\"}"
            w="${w#\"}"
        fi
        # empty values are ignored
        if [ ! -z "$w" ]; then
            completecmd+=("-i$w")
        fi
    done

    local jfcomplete
    if jfcomplete=$(${completecmd[@]} 2>&1); then
        local quote suggestions
        quote=${cur:0:1}

        # Use single quotes by default if suggestions contains backslash (FQCN)
        if [ "$quote" == '' ] && [[ "$jfcomplete" =~ \\ ]]; then
            quote=\'
        fi

        if [ "$quote" == \' ]; then
            # single quotes: no additional escaping (does not accept ' in values)
            suggestions=$(for s in $jfcomplete; do printf $'%q%q%q\n' "$quote" "$s" "$quote"; done)
        elif [ "$quote" == \" ]; then
            # double quotes: double escaping for \ $ ` "
            suggestions=$(for s in $jfcomplete; do
                s=${s//\\/\\\\}
                s=${s//\$/\\\$}
                s=${s//\`/\\\`}
                s=${s//\"/\\\"}
                printf $'%q%q%q\n' "$quote" "$s" "$quote";
            done)
        else
            # no quotes: double escaping
            suggestions=$(for s in $jfcomplete; do printf $'%q\n' $(printf '%q' "$s"); done)
        fi
        COMPREPLY=($(IFS=$'\n' compgen -W "$suggestions" -- $(printf -- "%q" "$cur")))
        __ltrim_colon_completions "$cur"
    else
        if [[ "$jfcomplete" != *"Command \"_complete\" is not defined."* ]]; then
            >&2 echo
            >&2 echo $jfcomplete
        fi

        return 1
    fi
}

complete -F _jf_{{ COMMAND_NAME }} {{ COMMAND_NAME }}
