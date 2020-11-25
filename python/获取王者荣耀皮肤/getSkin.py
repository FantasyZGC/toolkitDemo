import requests
import os


def save_IMG(hero_id, hero_name, skin_names, path):
    # 保存到指定目录，不存在则创建
    if not os.path.exists(path):
        os.mkdir(path)

    if not os.path.exists(path + "/" + hero_name):
        os.mkdir(path + "/" + hero_name)

    # skin_names 是皮肤名的列表，获取其长度，然后遍历获取它的下标
    for i in range(len(skin_names)):

        # 获取皮肤的 url 格式如下
        img_url = "https://game.gtimg.cn/images/yxzj/img201606/skin/hero-info/" + \
            str(hero_id) + "/" + str(hero_id) + \
            "-bigskin-" + str(i + 1) + ".jpg"

        # 发送请求。当 status_code 为 200 时，表明服务器已成功处理了请求.
        response = requests.get(img_url)
        if response.status_code == 200:
            # 保存在指定文件中，自定义图片名：英雄名-皮肤编号-皮肤名称
            with open(path+'/' + hero_name + "/" + hero_name + "-" + str(i+1) + "-" + skin_names[i] + '.jpg', 'wb') as f:
                f.write(response.content)  # requests库的方法


if __name__ == "__main__":
    # 先获取保存英雄信息的 json 文件
    url = "https://pvp.qq.com/web201605/js/herolist.json"
    header = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36"
    }
    response = requests.get(url, headers=header)
    hero_list = response.json()

    # 我们需要英雄的编号，名称，以及皮肤名，用于后续拼接 url 和下载
    name = input("请输入要爬取的英雄名称：")
    for hero_dic in hero_list:
        hero_id = hero_dic["ename"]
        hero_name = hero_dic["cname"]
        skin_names = hero_dic["skin_name"].split("|")  # 分割出皮肤名称

        # 如果想爬取全部英雄的皮肤，就不需要判断了，直接遍历列表即可
        if hero_name == name:
            save_IMG(hero_id, hero_name, skin_names,
                     "./皮肤")  # 自定义保存图片的文件夹
            break
