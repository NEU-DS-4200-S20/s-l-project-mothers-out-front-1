# Viewing People Power
Rachel Waddell, Nanxi Gu, Maris McGuinness

This project aims to support our client, [Mothers Out Front](https://www.mothersoutfront.org/), to visualize the membership at each level of the Ladder of Engagement.

## The GitHub Pages Website

The github pages of the project can be found here: 
https://neu-ds-4200-s20.github.io/s-l-project-mothers-out-front-1/

## Setup

**Under no circumstances should you be editing files via the GitHub user interface.** Do all your edits locally after cloning the repository.

1. Clone this repository to your local machine. E.g., in your terminal / command prompt `CD` to where you want this the folder for this activity to be. Then run `git clone <YOUR_REPO_URL>`

1. In `README.md` update the URL above to point to your GitHub pages website.

1. `CD` or open a terminal / command prompt window into the cloned folder.

1. Start a simple python webserver. E.g., one of these commands:
    * `python -m http.server 8000`
    * `python3 -m http.server 8000`
    * `py -m http.server 8000`
    If you are using Python 2 you will need to use `python -m SimpleHTTPServer 8000` instead, but please switch to Python 3 as [Python 2 will be sunset on 2020.01.01](https://www.python.org/doc/sunset-python-2/).

1. Wait for the output: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`

1. Now open your web browser (Firefox or Chrome) and navigate to the URL: http://localhost:8000

## Root Files
* `README.md` is this explanatory file for the repo.

* `index.html` contains the main website content. It includes comments surrounded by `<!--` and `-->` to help guide you through making your edits.

* `style.css` contains the CSS.

* `LICENCE` is your source code license.

## Folders
Each folder has an explanatory `README.md` file

* `data` stores data files.

* `favicons` contains the favicons for the course projects.

* `files` contains our sketch and task images (PNG) and video (MP4).

* `images` contains screenshots, diagrams, and photos.

* `js` will contain all JavaScript files written.
  * `map.js` contains all functions to create the map visualization.
  * `person.js` contains all functions to create the person bar chart visualization.
  * `visualization.js` simply creates the national graph from the person file, it is done in this file to preserve proper ordering. Each visualization should be built following the [Reusable Chart model](https://bost.ocks.org/mike/chart/)
  
* `lib` contains JavaScript libraries you used. 

## Demo Video of the Project

You can find a brief introduction and some quick demonstations through this [video](https://drive.google.com/open?id=1cE6q7mL7y-6CHk56zQbekx6zwumxNniB)
    
