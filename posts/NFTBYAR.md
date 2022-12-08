---
title: 'ARMakeNFT'
date: '2022-12-08'
---

![](https://images.pexels.com/photos/45204/alm-friuli-snow-snowfall-45204.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)


# AR自成NFT

放弃IPFS, 拥抱AR :white_flower: 

教程主要是过一遍如何放弃IPFS, 用AR来做NFT

最后的结果展示: [戳我]()

---

### ArDrive准备

1. 可以白嫖0.2AR体验, 步骤参考 [ArDrive官网](https://ardrive.io/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B/ ) . 发个推, 小号不是很容易验证通过 领取点水0.2AR, 这一步完成之后是有一个json文件, 里面写着钱包的私钥类信息.

2. 完了之后用[ArConnect](https://www.arconnect.io/), AR的插件钱包 导入我们刚刚下载下来的Json文件, 注意看下面步骤演示

   ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20221208195754.png)

   ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20221208195921.png)

3. 钱包导入成功之后, 登陆 https://app.ardrive.io/ 就可以 来到这里注册登陆

   ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20221208200133.png)

提供一个用户名和密码 注册一下 就可以.

![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20221208200246.png)

---

### ArDrive使用

1. Drive和Folder, Drive里面有好多Folder, 可以单独把Drive share给别人, 注意 ⚠️ 创建Drive的时候 会让你选择Public或者Private. Public和Private 详情请看这里 [Here](https://ardrive.io/features/public-or-private/), 字面理解就好, 不过多解释.

   1. 注意每个Drive和Folder 都会有自己的一串标识, `https://app.ardrive.io/#/drives/ee70c85b-f140-49c7-80b1-856625fcb103/folders/77c4b073-5ce5-4f5a-bd59-b3a14e29a68d ` 比如这个链接, 
      1. FolderID=`77c4b073-5ce5-4f5a-bd59-b3a14e29a68d` 后面upload的时候会用, 需要指定上传的FolderID
      2. DriveID=`ee70c85b-f140-49c7-80b1-856625fcb103`

   ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20221208200632.png)

2. 正常上传数据即可, 上传完图片之后, 我们会有这样的一个展示, 拿到DataID之后, 用这个网关➕dataID 即可访问, 比如  https://arweave.net/l1n24_cORIcDAOkzFc0I1IWs2qvv-eelHp4Qgb1f9vk ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20221208201846.png)

----

### NFT

1. 上传图片

   - 到这一步的话, 我们就可以把图片上传到AR, 并且拿回相应的DataID了

     ```javascript
     const { readJWKFile, arDriveFactory, wrapFileOrFolder, EID } = require('ardrive-core-js');
     
     //wallet是 你的json文件, 下载下来的那个
     //filePath是 png的路径
     //FolderID就是上面我们指出的那个
     async function upload(wallet, filePath, folderID){
         const arDrive = arDriveFactory({ wallet: wallet });
         const wrappedEntity = wrapFileOrFolder(filePath);
     
         const destFolderId = EID(folderID);
     
         const uploadFileResult = await arDrive.uploadAllEntities({
             entitiesToUpload: [{ wrappedEntity, destFolderId }]
         });
     
         let {created} = uploadFileResult;
       	// 返回的就是DataID
         return created[0].dataTxId.transactionId;
     }
     ```

   - 每upload一张图片, 返回dataID, 那么就可以有一个JsonFile的生成

     ```json
     {
       "name":"name #0",
       "description":"balabala.",
       "traits":[
         {"trait_type":"backgroud","value":"blue"},
         {"trait_type":"body","value":"body"},
         {"trait_type":"eye","value":"happy"},
         {"trait_type":"hat","value":"hat"},
         {"trait_type":"clothes","value":"hoodie_B"},
         {"trait_type":"plant","value":"alsophilaspinulosa"}
       ],
       "image":"https://arweave.net/l1n24_cORIcDAOkzFc0I1IWs2qvv-eelHp4Qgb1f9vk"}
     ```

   - 这里说一下费用, 每笔tx有两个字段和费用有关, 比如这笔[tx](https://viewblock.io/arweave/tx/P107fyT2M4mqu_WpDMINP2QWW9SjW_UxrhkL54gM7nA) :point_left:

     - Fee: 我们为这个文件存储所花的费用, 也就是存储文件的大头 :face_with_head_bandage: , 上面那笔tx 是对应655kb的png, Fee是 0.000109AR
     - Value: 这个字段类似于在eth上面的value字段, 不过gas也会在这里面

2. 以目录形式上传json文件

   - 上传完所有的png之后, 我们会有很多json文件在一个目录下

   - 这时候我们要做的就是 **以目录可访问的形式** 上传这些jsonFile

   - 两种方法

     > - 注意 **arupload**是json的文件夹, wallet.json里面这是钱包私钥等信息[最开始下载下来的json文件:apple: ]
     > - 自己替换一下

     - 简单的: 利用第三方来做, 参考这个[arkb github](https://github.com/textury/arkb), **这个貌似要收10%额外的费用,** 

       - `npm install -g arkb` 全局安装完之后

       - `arkb deploy ./arupload/ --wallet ./wallet.json` 用这个语句上传即可

       - 上传完之后, 会返回下图

         ![](https://raw.githubusercontent.com/skyonedot/picture-host/master/20221208204938.png)

         这个url再加上后缀, 比如 https://arweave.net/8qWYL9oyX5oPU9dwMHWii8ZlonEYatK-P2k_RXpfbs4/1.json 就可以访问了

     - 复杂的: 比较原生, 是AR自己的这套东西. 参考[ardrive-cli github](https://github.com/ardriveapp/ardrive-cli)

       - `npm install -g ardrive-cli`

       - `ardrive upload-file --local-path ./arupload/ --parent-folder-id "2639094e-cb4a-4546-b5fb-f582db582fae" -w ./wallet.json`

         > 注意这里的parent-folder-id 参数, 这是我们上面说的FolderID

       - `ardrive create-manifest -f "2639094e-cb4a-4546-b5fb-f582db582fae" -w ./wallet.json`

         >  同样 这里 -f 也是folderID

       - 上传完之后 返回下图

         ![image-20221208205214752](/Users/skyone/Library/Application Support/typora-user-images/image-20221208205214752.png)

3. 基本上到这里就结束了, 在etherscan上面设置一下tokenURI即可, 格式: ar//《hash》 比如根据上面这个复杂的红框里的值, 则是设成: ar://ruwoIvbk7oLa87xKUTd-_DY4MGJ6UR8iWEE3egRkfOI

---





### 参考文献

https://mirror.xyz/pfeffunit.eth/iLX1IKglGDxRTufg64RdYJCrNRAMIogmLhfdJ6ZAXUY

https://blog.developerdao.com/getting-started-with-arweave#heading-introduction-to-arweave

https://docs.arweave.org/info/