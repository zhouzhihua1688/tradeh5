var nations=[
  {"nationCode":"156", "nationName":"中国"},
  {"nationCode":"344", "nationName":"中国香港"},
  {"nationCode":"446", "nationName":"中国澳门"},
  {"nationCode":"158", "nationName":"中国台湾"},
  {"nationCode":"840", "nationName":"美国"},
  {"nationCode":"826", "nationName":"英国"},
  {"nationCode":"250", "nationName":"法国"},
  {"nationCode":"410", "nationName":"韩国"},
  {"nationCode":"392", "nationName":"日本"},
  {"nationCode":"276", "nationName":"德国"},
  {"nationCode":"036", "nationName":"澳大利亚"},
  {"nationCode":"008", "nationName":"阿尔巴尼亚"},
  {"nationCode":"012", "nationName":"阿尔及利亚"},
  {"nationCode":"004", "nationName":"阿富汗"},
  {"nationCode":"032", "nationName":"阿根廷"},
  {"nationCode":"784", "nationName":"阿联酋"},
  {"nationCode":"533", "nationName":"阿鲁巴"},
  {"nationCode":"512", "nationName":"阿曼"},
  {"nationCode":"031", "nationName":"阿塞拜疆"},
  {"nationCode":"818", "nationName":"埃及"},
  {"nationCode":"231", "nationName":"埃塞俄比亚"},
  {"nationCode":"372", "nationName":"爱尔兰"},
  {"nationCode":"233", "nationName":"爱沙尼亚"},
  {"nationCode":"020", "nationName":"安道尔"},
  {"nationCode":"024", "nationName":"安哥拉"},
  {"nationCode":"660", "nationName":"安圭拉"},
  {"nationCode":"028", "nationName":"安提瓜和巴布达"},
  {"nationCode":"040", "nationName":"奥地利"},
  {"nationCode":"052", "nationName":"巴巴多斯"},
  {"nationCode":"598", "nationName":"巴布亚新几内亚"},
  {"nationCode":"044", "nationName":"巴哈马"},
  {"nationCode":"586", "nationName":"巴基斯坦"},
  {"nationCode":"600", "nationName":"巴拉圭"},
  {"nationCode":"374", "nationName":"巴勒斯坦"},
  {"nationCode":"048", "nationName":"巴林"},
  {"nationCode":"591", "nationName":"巴拿马"},
  {"nationCode":"076", "nationName":"巴西"},
  {"nationCode":"112", "nationName":"白俄罗斯"},
  {"nationCode":"060", "nationName":"百慕大"},
  {"nationCode":"100", "nationName":"保加利亚"},
  {"nationCode":"580", "nationName":"北马里亚纳"},
  {"nationCode":"585", "nationName":"贝劳"},
  {"nationCode":"204", "nationName":"贝宁"},
  {"nationCode":"056", "nationName":"比利时"},
  {"nationCode":"352", "nationName":"冰岛"},
  {"nationCode":"630", "nationName":"波多黎各"},
  {"nationCode":"616", "nationName":"波兰"},
  {"nationCode":"070", "nationName":"波斯尼亚和黑塞哥维那"},
  {"nationCode":"068", "nationName":"玻利维亚"},
  {"nationCode":"084", "nationName":"伯利兹"},
  {"nationCode":"072", "nationName":"博茨瓦纳"},
  {"nationCode":"064", "nationName":"不丹"},
  {"nationCode":"854", "nationName":"布基纳法索"},
  {"nationCode":"108", "nationName":"布隆迪"},
  {"nationCode":"074", "nationName":"布维岛"},
  {"nationCode":"408", "nationName":"朝鲜"},
  {"nationCode":"226", "nationName":"赤道几内亚"},
  {"nationCode":"208", "nationName":"丹麦"},
  {"nationCode":"626", "nationName":"东帝汶"},
  {"nationCode":"768", "nationName":"多哥"},
  {"nationCode":"214", "nationName":"多米尼加共和国"},
  {"nationCode":"212", "nationName":"多米尼克"},
  {"nationCode":"643", "nationName":"俄罗斯"},
  {"nationCode":"218", "nationName":"厄瓜多尔"},
  {"nationCode":"232", "nationName":"厄立特里亚"},
  {"nationCode":"234", "nationName":"法罗群岛"},
  {"nationCode":"258", "nationName":"法属波利尼西亚"},
  {"nationCode":"254", "nationName":"法属圭亚那"},
  {"nationCode":"260", "nationName":"法属南部领土"},
  {"nationCode":"336", "nationName":"梵蒂冈"},
  {"nationCode":"608", "nationName":"菲律宾"},
  {"nationCode":"242", "nationName":"斐济"},
  {"nationCode":"246", "nationName":"芬兰"},
  {"nationCode":"132", "nationName":"佛得角"},
  {"nationCode":"270", "nationName":"冈比亚"},
  {"nationCode":"178", "nationName":"刚果"},
  {"nationCode":"170", "nationName":"哥伦比亚"},
  {"nationCode":"188", "nationName":"哥斯达黎加"},
  {"nationCode":"308", "nationName":"格林纳达"},
  {"nationCode":"304", "nationName":"格陵兰"},
  {"nationCode":"268", "nationName":"格鲁吉亚"},
  {"nationCode":"192", "nationName":"古巴"},
  {"nationCode":"312", "nationName":"瓜德罗普"},
  {"nationCode":"316", "nationName":"关岛"},
  {"nationCode":"328", "nationName":"圭亚那"},
  {"nationCode":"398", "nationName":"哈萨克斯坦"},
  {"nationCode":"332", "nationName":"海地"},
  {"nationCode":"528", "nationName":"荷兰"},
  {"nationCode":"530", "nationName":"荷属安的列斯"},
  {"nationCode":"334", "nationName":"赫德岛和麦克唐纳岛"},
  {"nationCode":"340", "nationName":"洪都拉斯"},
  {"nationCode":"296", "nationName":"基里巴斯"},
  {"nationCode":"262", "nationName":"吉布提"},
  {"nationCode":"417", "nationName":"吉尔吉斯斯坦"},
  {"nationCode":"324", "nationName":"几内亚"},
  {"nationCode":"624", "nationName":"几内亚比绍"},
  {"nationCode":"124", "nationName":"加拿大"},
  {"nationCode":"288", "nationName":"加纳"},
  {"nationCode":"266", "nationName":"加蓬"},
  {"nationCode":"116", "nationName":"柬埔寨"},
  {"nationCode":"203", "nationName":"捷克"},
  {"nationCode":"716", "nationName":"津巴布韦"},
  {"nationCode":"120", "nationName":"喀麦隆"},
  {"nationCode":"634", "nationName":"卡塔尔"},
  {"nationCode":"136", "nationName":"开曼群岛"},
  {"nationCode":"166", "nationName":"科科斯（基林）群岛"},
  {"nationCode":"174", "nationName":"科摩罗"},
  {"nationCode":"384", "nationName":"科特迪瓦"},
  {"nationCode":"414", "nationName":"科威特"},
  {"nationCode":"191", "nationName":"克罗地亚"},
  {"nationCode":"404", "nationName":"肯尼亚"},
  {"nationCode":"184", "nationName":"库克群岛"},
  {"nationCode":"428", "nationName":"拉脱维亚"},
  {"nationCode":"426", "nationName":"莱索托"},
  {"nationCode":"418", "nationName":"老挝"},
  {"nationCode":"422", "nationName":"黎巴嫩"},
  {"nationCode":"440", "nationName":"立陶宛"},
  {"nationCode":"430", "nationName":"利比里亚"},
  {"nationCode":"434", "nationName":"利比亚"},
  {"nationCode":"438", "nationName":"列支敦士登"},
  {"nationCode":"638", "nationName":"留尼汪"},
  {"nationCode":"442", "nationName":"卢森堡"},
  {"nationCode":"646", "nationName":"卢旺达"},
  {"nationCode":"642", "nationName":"罗马尼亚"},
  {"nationCode":"450", "nationName":"马达加斯加"},
  {"nationCode":"462", "nationName":"马尔代夫"},
  {"nationCode":"238", "nationName":"马尔维纳斯群岛"},
  {"nationCode":"470", "nationName":"马耳他"},
  {"nationCode":"454", "nationName":"马拉维"},
  {"nationCode":"458", "nationName":"马来西亚"},
  {"nationCode":"466", "nationName":"马里"},
  {"nationCode":"807", "nationName":"马其顿"},
  {"nationCode":"584", "nationName":"马绍尔群岛"},
  {"nationCode":"474", "nationName":"马提尼克"},
  {"nationCode":"175", "nationName":"马约特"},
  {"nationCode":"480", "nationName":"毛里求斯"},
  {"nationCode":"478", "nationName":"毛里塔尼亚"},
  {"nationCode":"016", "nationName":"美属萨摩亚"},
  {"nationCode":"581", "nationName":"美属太平洋各群岛"},
  {"nationCode":"850", "nationName":"美属维尔京群岛"},
  {"nationCode":"496", "nationName":"蒙古"},
  {"nationCode":"500", "nationName":"蒙特塞拉特"},
  {"nationCode":"050", "nationName":"孟加拉国"},
  {"nationCode":"604", "nationName":"秘鲁"},
  {"nationCode":"583", "nationName":"密克罗尼西亚"},
  {"nationCode":"104", "nationName":"缅甸"},
  {"nationCode":"498", "nationName":"摩尔多瓦"},
  {"nationCode":"504", "nationName":"摩洛哥"},
  {"nationCode":"492", "nationName":"摩纳哥"},
  {"nationCode":"508", "nationName":"莫桑比克"},
  {"nationCode":"484", "nationName":"墨西哥"},
  {"nationCode":"516", "nationName":"纳米比亚"},
  {"nationCode":"710", "nationName":"南非"},
  {"nationCode":"010", "nationName":"南极洲"},
  {"nationCode":"239", "nationName":"南乔治亚岛和南桑德韦奇岛"},
  {"nationCode":"891", "nationName":"南斯拉夫联盟共和国"},
  {"nationCode":"520", "nationName":"瑙鲁"},
  {"nationCode":"524", "nationName":"尼泊尔"},
  {"nationCode":"558", "nationName":"尼加拉瓜"},
  {"nationCode":"562", "nationName":"尼日尔"},
  {"nationCode":"566", "nationName":"尼日利亚"},
  {"nationCode":"570", "nationName":"纽埃"},
  {"nationCode":"578", "nationName":"挪威"},
  {"nationCode":"574", "nationName":"诺福克岛"},
  {"nationCode":"612", "nationName":"皮特凯恩群岛"},
  {"nationCode":"620", "nationName":"葡萄牙"},
  {"nationCode":"752", "nationName":"瑞典"},
  {"nationCode":"756", "nationName":"瑞士"},
  {"nationCode":"222", "nationName":"萨尔瓦多"},
  {"nationCode":"694", "nationName":"塞拉利昂"},
  {"nationCode":"686", "nationName":"塞内加尔"},
  {"nationCode":"196", "nationName":"塞浦路斯"},
  {"nationCode":"690", "nationName":"塞舌尔"},
  {"nationCode":"682", "nationName":"沙特阿拉伯"},
  {"nationCode":"162", "nationName":"圣诞岛"},
  {"nationCode":"678", "nationName":"圣多美和普林西比"},
  {"nationCode":"654", "nationName":"圣赫勒拿"},
  {"nationCode":"659", "nationName":"圣基茨和尼维斯"},
  {"nationCode":"662", "nationName":"圣卢西亚"},
  {"nationCode":"674", "nationName":"圣马力诺"},
  {"nationCode":"666", "nationName":"圣皮埃尔和密克隆"},
  {"nationCode":"670", "nationName":"圣文森特和格林纳丁斯"},
  {"nationCode":"144", "nationName":"斯里兰卡"},
  {"nationCode":"703", "nationName":"斯洛伐克"},
  {"nationCode":"705", "nationName":"斯洛文尼亚"},
  {"nationCode":"744", "nationName":"斯瓦尔巴群岛"},
  {"nationCode":"748", "nationName":"斯威士兰"},
  {"nationCode":"736", "nationName":"苏丹"},
  {"nationCode":"740", "nationName":"苏里南"},
  {"nationCode":"090", "nationName":"所罗门群岛"},
  {"nationCode":"706", "nationName":"索马里"},
  {"nationCode":"762", "nationName":"塔吉克斯坦"},
  {"nationCode":"764", "nationName":"泰国"},
  {"nationCode":"834", "nationName":"坦桑尼亚"},
  {"nationCode":"776", "nationName":"汤加"},
  {"nationCode":"796", "nationName":"特克斯和凯科斯群岛"},
  {"nationCode":"780", "nationName":"特立尼达和多巴哥"},
  {"nationCode":"788", "nationName":"突尼斯"},
  {"nationCode":"798", "nationName":"图瓦卢"},
  {"nationCode":"792", "nationName":"土耳其"},
  {"nationCode":"795", "nationName":"土库曼斯坦"},
  {"nationCode":"772", "nationName":"托克劳"},
  {"nationCode":"876", "nationName":"瓦利斯和富图纳群岛"},
  {"nationCode":"548", "nationName":"瓦努阿图"},
  {"nationCode":"320", "nationName":"危地马拉"},
  {"nationCode":"862", "nationName":"委内瑞拉"},
  {"nationCode":"096", "nationName":"文莱"},
  {"nationCode":"800", "nationName":"乌干达"},
  {"nationCode":"804", "nationName":"乌克兰"},
  {"nationCode":"858", "nationName":"乌拉圭"},
  {"nationCode":"860", "nationName":"乌兹别克斯坦"},
  {"nationCode":"724", "nationName":"西班牙"},
  {"nationCode":"732", "nationName":"西撒哈拉"},
  {"nationCode":"882", "nationName":"西萨摩亚"},
  {"nationCode":"300", "nationName":"希腊"},
  {"nationCode":"702", "nationName":"新加坡"},
  {"nationCode":"540", "nationName":"新喀里多尼亚"},
  {"nationCode":"554", "nationName":"新西兰"},
  {"nationCode":"348", "nationName":"匈牙利"},
  {"nationCode":"760", "nationName":"叙利亚"},
  {"nationCode":"388", "nationName":"牙买加"},
  {"nationCode":"051", "nationName":"亚美尼亚"},
  {"nationCode":"887", "nationName":"也门"},
  {"nationCode":"368", "nationName":"伊拉克"},
  {"nationCode":"364", "nationName":"伊朗"},
  {"nationCode":"376", "nationName":"以色列"},
  {"nationCode":"380", "nationName":"意大利"},
  {"nationCode":"356", "nationName":"印度"},
  {"nationCode":"360", "nationName":"印度尼西亚"},
  {"nationCode":"092", "nationName":"英属维尔京群岛"},
  {"nationCode":"086", "nationName":"英属印度洋领土"},
  {"nationCode":"400", "nationName":"约旦"},
  {"nationCode":"704", "nationName":"越南"},
  {"nationCode":"894", "nationName":"赞比亚"},
  {"nationCode":"180", "nationName":"扎伊尔"},
  {"nationCode":"148", "nationName":"乍得"},
  {"nationCode":"292", "nationName":"直布罗陀"},
  {"nationCode":"152", "nationName":"智利"},
  {"nationCode":"140", "nationName":"中非"}
]
