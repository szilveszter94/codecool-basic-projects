//YOUR CODE COMES HERE

// task 1
let favoriteBooks = [
    {"title": "1984",
    "author": "George Orwell",
    "year": 1949,
    "isNewerThan2000":false,
    "age":74,
    "characters": ["Winston Smith", "Julia", "O'Brian", "Emmanuel Goldstein"]
    },
    {"title": "Lord of the Flies",
    "author": "William Golding",
    "year": 1954,
    "isNewerThan2000":false,
    "age":69,
    "characters": ["Jack", "Ralph", "Piggy", "Simon"]
    }];

let favMovies = [{
    "title":"The Godfather",
    "year":1972,
    "rating":9.2,
    "description":"Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
    "directors":["Francis Ford Coppola"],
    "writers":["Mario Puzo", "Francis Ford Coppola"],
    "stars":["Marlon Brando", "Al Pacino", "James Caan"],
    "genres":["Crime", "Drama"]
},
{
    "title":"Fight Club",
    "year":1999,
    "rating":8.8,
    "description":"An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    "directors":["David Fincher"],
    "writers":["Chuck Palahniuk", "Jim Uhls"],
    "stars":["Brad Pitt", "Edward Norton", "Meat Loaf"],
    "genres":["Drama"]
},
{
    "title":"Se7en",
    "year":1995,
    "rating":8.6,
    "description":"Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    "directors":["David Fincher"],
    "writers":["Andrew Kevin Walker"],
    "stars":["Morgan Freeman", "Brad Pitt", "Kevin Spacey"],
    "genres":["Crime", "Drama", "Mystery"]
},
{
    "title":"American Psycho",
    "year":2000,
    "rating":7.6,
    "description":"A wealthy New York City investment banking executive, Patrick Bateman, hides his alternate psychopathic ego from his co-workers and friends as he delves deeper into his violent, hedonistic fantasies.",
    "directors":["Mary Harron"],
    "writers":["Bret Easton", "EllisMary Harron", "Guinevere Turner"],
    "stars":["Christian Bale", "Justin Theroux", "Josh Lucas"],
    "genres":["Crime", "Drama", "Horror"]
}];

let bestSellingAlbums = [
{
    artist: "Michael Jackson",
    title: "Thriller",
    year: 1982,
    genres: ["pop", "post-disco", "funk", "rock"],
    sale: 70000000,
},
{
    artist: "AC/DC",
    title: "Back in Black",
    year: 1980,
    genres: ["hard rock"],
    sale: 50000000,
},
{
    artist: "Whitney Houston",
    title: "The Bodyguard",
    year: 1992,
    genres: ["r&b", "soul", "pop", "soundtrack"],
    sale: 45000000,
},
{
    artist: "Pink Floyd",
    title: "The Dark Side of the Moon",
    year: 1973,
    genres: ["progressive rock"],
    sale: 45000000,
},
{
    artist: "Eagles",
    title: "Their Greatest Hits (1971 - 1975)",
    year: 1976,
    genres: ["country rock", "soft rock", "folk rock"],
    sale: 44000000,
},
{
    artist: "Eagles",
    title: "Hotel California",
    year: 1976,
    genres: ["soft rock"],
    sale: 42000000,
},
{
    artist: "Shania Twain",
    title: "Come On Over",
    year: 1997,
    genres: ["country", "pop"],
    sale: 40000000,
},
{
    artist: "Fleetwood Mac",
    title: "Rumours",
    year: 1977,
    genres: ["soft rock"],
    sale: 40000000,
},];

// task 2
let currentYear = new Date().getFullYear();

function averageAge(array, year){
    let avg = 0
    for (let i of array) {
        avg += year - i.year;
    }
    let result = avg / array.length
    console.log(result);
}

averageAge(favoriteBooks, currentYear);
averageAge(favMovies, currentYear);
averageAge(bestSellingAlbums, currentYear);

// task 3
function average(array, category){
    let avg = 0
    for (let i of array) {
        if (typeof(i[category] === "number")){
            avg += i[category];
        }
    }
    let result = avg / array.length
    console.log(result);
}

average(favMovies, "rating");
average(bestSellingAlbums, "sale");

// task 4

function latestOrOldest(array, bool){
    if (typeof(bool) === "boolean"){
        let latest = array[0].year;
        let title = array[0].title;
        for (let i of array) {
            if (bool){
                if (i.year > latest){
                    latest = i.year;
                    title = i.title;
                }
            } else {
                if (i.year < latest){
                    latest = i.year;
                    title = i.title;
                }
            }
        }
        console.log(title);
    } else {
        console.log("Type error, wrong parameter");
    } 
}
latestOrOldest(favoriteBooks, true);
latestOrOldest(favMovies, true);
latestOrOldest(bestSellingAlbums, false);




// DON'T MODIFY THE CODE BELOW THIS LINE

let toExport;

try {
	toExport = [
		{name: "favoriteBooks", content: favoriteBooks, type: "array"},
        {name: "favMovies", content: favMovies, type: "array"},
        {name: "bestSellingAlbums", content: bestSellingAlbums, type: "array"},
        {name: "averageAge", content: averageAge, type: "function"},
        {name: "average", content: average, type: "function"},
        {name: "latestOrOldest", content: latestOrOldest, type: "function"},

	]
} catch (error) {
	toExport = {error: error.message}
}

export {toExport};
