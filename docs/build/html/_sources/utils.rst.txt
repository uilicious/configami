Utils
=====================================

**Handlebars**

Configami uses Handlebars, see https://handlebarsjs.com/ if you aren't familiar with it.

In addition, Configami has some extra helpers that you may find handy when working with .yaml files

**json2yaml**


Given a JSON object, stringify it into a yaml format.
This is designed to be used in a larger yaml template

For Examples:

input.json

json::

    {
        "hello": {
            "world": [1,2]
        }
    }

template.yaml

yaml::

    hello:
        {{#json2yaml "hello.world"}}{{/json2yaml}}
    
output.yaml

yaml::

    hello:
        - 1
        - 2


**forUntil**

Given an integer, iterate and provide the index for it
For Examples:

input.json

json::

    {
        "count": 2
    }

template.yaml

yaml::

    hello:
        {{#forUntil "count"}}
        - @index
        {{/forUntil}}


output.yaml

yaml::

    hello:
    - 1
    - 2

**base64encode**

Convert the input string, into its base64 encoded form
For Examples:

template.yaml

yaml::

    hello:
        {{#base64encode}}Some Value To Encoded{{/base64encode}}


