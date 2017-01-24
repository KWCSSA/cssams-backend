var leftEng = ["admiring","adoring","affectionate","agitated","amazing",
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

var left = ["大方", "年轻", "聪明", "雪白", "漂亮", "笔直", "时尚", "平等",
						"优秀", "慌张", "俗气", "马虎", "博学", "主观", "明快", "高兴",
						"幸福", "清楚", "明确", "结实", "具体", "伟大", "勇敢", "坚强",
						"温柔", "平淡", "简单", "固执", "醒目", "干净", "傲慢", "倔强",
						"脆弱", "乐观", "爽朗", "豪放", "开朗", "爱笑", "娇柔", "友好",
						"活泼", "昂贵", "孤独", "好动", "愉快", "热情", "可亲", "健谈",
						"轻松", "机敏", "外向", "兴奋", "强烈", "率直", "语言", "行动",
						"善良", "文雅", "整洁", "内向", "沉静", "稳重", "顺从", "温和",
						"老实", "沉著", "和平", "体贴", "忠诚", "知足", "果断", "首领",
						"喜爱", "善变", "细节", "保守", "忠心", "费解", "自信", "独立",
						"不凡", "悠然", "从容", "迷人", "淡定", "海涵", "洋气", "高雅",
						"风度", "随和", "王者", "潇洒", "宽容", "迷茫", "困惑", "乏困",
						"疲倦"
];

var rightEng = ["isa","allen","almeida","agnesi","archimedes",
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

var right = ["泡泡糖", "肉包子", "饺子", "粽子", "桃子", "苹果", "樱桃", "白富美",
							"高富帅", "口香糖", "星星", "驴打滚", "芝麻", "狗不理", "猫耳朵", "泡芙",
							"糯米糍", "热狗", "镜子", "架子鼓", "吉他", "香蕉", "黄瓜", "茄子",
							"剪刀", "擎天柱", "大黄蜂", "绿巨人", "可爱多", "麦当劳", "肯德基", "汉堡",
							"豆汁", "元宵", "哆啦A梦", "史努比", "龙猫", "喷泉", "地鼠", "枫叶",
							"冰淇淋", "熊猫", "草莓", "丘比特", "皮卡丘", "跳跳虎", "维尼熊", "米奇",
							"寿司", "咖喱块", "甜甜圈", "兔耳朵", "咖啡", "奶茶", "小黄人", "海绵宝宝",
							"派大星", "哈利波特", "邓布利多", "卫龙", "老干妈", "雪糕", "毛豆", "布丁",
							"奥利奥", "菜包子", "红烧肉", "红薯", "烧麦", "串串香", "枫糖", "银耳",
							"鬼怪", "地狱使者", "新娘", "新郎", "史莱克", "小公主", "老司机", "宋仲基",
							"备胎", "牛仔", "洛丽塔"
];

var getRandomName = function() {
  var adjIndex = Math.floor(Math.random() * left.length);
  var surnameIndex = Math.floor(Math.random() * right.length);

  var adj = left[adjIndex];
  var surname = right[surnameIndex];

  // var rand = Math.floor(Math.random() * 10) + 1;

  var fullname = adj + '的' + surname;

  return fullname;
};

module.exports = getRandomName;
