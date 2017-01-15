var left = ["admiring","adoring","affectionate","agitated","amazing",
		        "angry","awesome","blissful","boring","brave","clever",
		        "cocky","compassionate","competent","condescending","confident",
		        "cranky","dazzling","determined","distracted","dreamy",
            "eager","ecstatic","elastic","elated","elegant",
		        "eloquent","epic","fervent","festive","flamboyant",
		        "focused","friendly","frosty","gallant","gifted",
        		"goofy","gracious","happy","hardcore","heuristic",
        		"hopeful","hungry","infallible","inspiring","jolly",
        		"jovial","keen","kickass","kind","laughing",
        		"loving","lucid","mystifying","modest","musing",
        		"naughty","nervous","nifty","nostalgic","objective",
            "optimistic","peaceful","pedantic","pensive","practical",
        		"priceless","quirky","quizzical","relaxed","reverent",
          	"romantic","sad","serene","sharp","silly",
            "sleepy","stoic","stupefied","suspicious","tender",
          	"thirsty","trusting","unruffled","upbeat","vibrant",
          	"vigilant","wizardly","wonderful","xenodochial","youthful",
          	"zealous","zen"
];

var right = ["albattani","allen","almeida","agnesi","archimedes",
            "ardinghelli","aryabhata","austin","babbage","banach",
            "bardeen","bartik","bassi","beaver","bell",
            "bhabha","bhaskara","blackwell","bohr","booth",
            "borg","bose","boyd","brahmagupta","brattain",
            "brown","carson","chandrasekhar","shannon","clarke",
            "colden","cori","cray","curran","curie",
            "darwin","davinci","dijkstra","dubinsky","easley",
            "edison","einstein","elion","engelbart","euclid",
            "euler","fermat","fermi","feynman","franklin",
            "galileo","gates","goldberg","goldstine","goldwasser",
            "golick","goodall","haibt","hamilton","hawking",
            "heisenberg","heyrovsky","hodgkin","hoover","hopper",
            "hugle","hypatia","jang","jennings","jepsen",
            "joliot","jones","kalam","kare","keller",
            "khorana","kilby","kirch","knuth","kowalevski",
            "lalande","lamarr","lamport","leakey","leavitt",
            "lewin","lichterman","liskov","lovelace","lumiere",
            "mahavira","mayer","mccarthy","mcclintock","mclean",
            "mcnulty","meitner","meninsky","mestorf","minsky",
            "mirzakhani","morse","murdock","newton","nightingale",
            "nobel","noether","northcutt","noyce","panini",
            "pare","pasteur","payne","perlman","pike",
            "poincare","poitras","ptolemy","raman","ramanujan",
            "ride","montalcini","ritchie","roentgen","rosalind",
            "saha","sammet","shaw","shirley","shockley",
            "sinoussi","snyder","spence","stallman","stonebraker",
            "swanson","swartz","swirles","tesla","thompson",
            "torvalds","turing","varahamihira","visvesvaraya","volhard",
            "wescoff","wiles","williams","wilson","wing",
            "wozniak","wright","yalow","yonath"
];

var getRandomName = function(){
  var adjIndex = Math.floor(Math.random() * left.length) + 1;
  var surnameIndex = Math.floor(Math.random() * right.length) + 1;

  var adj = left[adjIndex];
  var surname = right[surnameIndex];

  var rand = Math.floor(Math.random() * 10) + 1;

  var fullname = adj + '_' + surname + rand;

  return fullname;
};

console.log(getRandomName());
