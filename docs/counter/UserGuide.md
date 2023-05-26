<p  align="center">
    <img width=300 src="https://raw.githubusercontent.com/tjtanjin/my-api/master/assets/app_logo.png" />
    <h1 align="center">Counter Module (User Guide)</h1>
</p>

## Table of Contents
* [Introduction](#introduction)
* [QuickStart](#quick-start)
* [API Documentation](#api-documentation)
* [Examples](#examples)
* [FAQ](#code-documentation)

<div  style="page-break-after: always;"></div>

## **Introduction**
SplitEasy is a telegram bot for users to easily manage shared expenses. It is designed with a **minimalistic and intuitive** style for ease of use and is thus simple to navigate around. New users should also find themselves able to quickly grasp the basics after a brief moment of experimentation with the bot.

This developer guide assumes its readers to have at least a **basic understanding** of [Python](https://www.python.org/) and [Python Telegram Bot](https://python-telegram-bot.org/). Otherwise, it is highly recommended for readers to refer to proper tutorial contents for the basics of Python/Python Telegram Bot prior to developing the application. It is also worth noting that this guide serves to cover **important design considerations** for the project. The designs are not perfect so you are encouraged to **think and explore possible improvements** for the application.

This guide **will not** dive into every single project detail because that is not sustainable in the long run. For simpler implementations that are not covered in this guide, you will find the code comments in the files themselves to be useful.

Finally, to setup the development environment, please refer to the project [README](https://github.com/four-city/fourcity-cms/blob/master/README.md).

  

## **Navigating this Developer Guide**
Before diving into the rest of the contents in our developer guide, the following are a few important syntaxes to take note of to facilitate your reading:

| Syntax               | Description                                                                       |
|----------------------|-----------------------------------------------------------------------------------|
| `Markdown`           | Denotes folders/files in the projects (e.g. `main.py`, `services`)                |
| *Italics*            | Denotes classes/functions/commands (e.g. *create_group*, *create_user*, */start*) |                                    
| **Bold**             | Keywords that are emphasized                                                      |

<div  style="page-break-after: always;"></div>

## **Design**
### Overview
At a high level overview, the entire project can be (broadly speaking) broken down into 3 major components which are as listed below:

-  `commands`
-  `conversations`
-  `services`

There are also 2 miscellaneous folders to take note of which are:

- `assets`
- `menus`

All the above are seated in their own folder, so it's relatively straightforward when looking at the project structure.

**How do the different parts interact with each other?**
For a start, `commands` and `conversations` **do not interact** with each other. In fact, some conversations are an extension of commands. However, unlike commands that **do not require feedback** from the user, conversations involve **at least one reply required** from the user. If this part is unclear to you, you may refer to the subsequent sections that will provide some examples.

The `services` component is **used extensively** by both the `commands` and `conversations` components. In particular, the `message_service` is responsible for replying/sending messages to the users while the `storage_service` is responsible for accessing the database to read/write information.

The `assets` folder contains a handful of JSON files that are required in the project which includes the list of supported currencies and timezones. It is also worth noting that the `lang` folder contains various language translations, thereby allowing support for internationalization of the bot. The choice of language is configured within the `.env` file.

Note: It is also advisable to **consult the code documentation** found within the files themselves when dealing with specific features.

### Commands
Commands are the most basic input that can be given by the user. For this component, `commands` **exclusively** refer to commands that **do not require any feedback from the user**. For example, the */start* command simply informs the user that he/she has been successfully registered and the */help* command simply returns the help message. In both of these instances, there is no need for the user to provide feedback/reply.

### Conversations
Conversations involve back and forth interaction between the user and the bot. For example, when the user wants to */select* a group, the bot will return a list of groups for the user to select from. This requires the user to provide further feedback and thus falls under this category of a conversation.

Note: While it is possible for commands to lead to conversations, said commands are directly included in the `conversations` component as well (i.e. you will not find said commands in the `commands` component).

### Services
While `commands` and `conversations` deal with the bulk of interactions between the user and the bot, the `services` component deal with the backend details such as reading/writing information about users/groups. You can think of each file here as a utility folder to perform very specific task.

### Assets
The `assets` folder contains various JSON files that are important for the proper functioning of the application. In particular, `currencies.json` and `timezones.json` contain the list of supported currencies/timezones.

Support for multiple languages can also be found within the `lang` folder. A quick glance at the language files, and you will notice many key-value pairs within the files associating a key with a translation in the specified language. As such, adding a new language is actually **very easy**. In fact, the tedious part would be the translation (google translating all of them is a good shortcut but it may not be accurate). The default language is **English (en-US)** and the loading of languages are handled in the `.env` file by the **LANGUAGE** variable.

### Menus
The `menus` folder contains a `builder.py` file that contains the logic for drawing up the menu in telegram (i.e. buttons). It is a very lightweight module but may grow as the project evolves.

## **Implementation**
*to be updated*

## **Code Documentation**
Code documentation is strongly encouraged to ensure that the codebase can be easily maintainable. As a rule of thumb, all `.py` files should have a description of what it does at the top of the file where it is declared.

Functions can be without documentation if they are small, self-explanatory and easy to understand by just looking at the code alone. For larger functions with more logic, it is still advisable to write code comments. In general, the following structure is adopted for writing comments:

```
"""
Retrieves the members of a group.
Args:
    group_id: id of group to get members for
    id_only: whether to return only ids
"""
```

The above shows an example of a function retrieving the members of a group. Note that it begins with a brief description of what the function does followed by highlighting its 2 parameters and what they are used for. You may look into any of the code files for more examples.

Finally, any leftover tasks or areas in the code to be revisited should be flagged with a comment like the one below:

```
// todo: tj to optimize the calculation code here
```

That way, we can identify what are the tasks to finish up here an optionally, who will be responsible for it.

## **Testing**
Unfortunately, the limited manpower and time frame for the project meant setting up of test cases was not done. However, this section was still created to highlight the importance of needing test cases. It is advisable for future maintainers to develop a suite of test cases for the project.

## **Final Notes**
The designs in this project are not perfect. Developers are strongly encouraged to continuously seek out area for improvements in the application.