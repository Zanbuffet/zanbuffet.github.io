

# *Reparing the Kingdom* devlog

已经完成触发对话

接下来要做每次按下按键都进行接下来的一段对话。

添加角色的istalking状态，让玩家在对话的时候不能移动。然后在manager里添加一个对话结束的事件，对话结束的时候让玩家恢复普通状态。----为了能让事件统一管理，是不是加一个eventManager比较好？

添加摄像机控制。

添加NPC不同的状态，触发不同的对话，而不是用enum实现。

不同角色对象说话。

 <br/>

在对话结束之后点击Z之后会立刻执行第二次对话。原因是先执行了Event，再执行了Update里面的TriggerConversation。换句话说是先变回了normal状态，又迅速切换回了对话状态。--- 靠协程解决了，感觉不太好。

 <br/>

让对话框成为一个预制件，有人说话时让这个人实例化这个对话框到Canvas下，以对应自己的位置。

对话的要素：语速，表情，姿势，内容

添加对话框对应角色的方法，添加多个对话框的方法。添加指定对话框消失的方法

添加预加载方法

 <br/>

让相机获取当前说话的角色和主角，让相机前往说话的角色的位置并且
让相机朝向当前说话的角色并且拉近一些镜头

在TriggerConversation里，把正在说话的角色这一部分功能拿出去，根据json文件来决定谁在说话，而不是根据跟谁触发的对话来设置谁在说话。也就是说
主角和NPC可以互相对话，有不同的对话类型，例如角色会思考，此时dialogbox会不同。 怎样把对话传递给不同的角色呢？
也许需要一个对象池，让dialogManager可以获取当前可以对话的人？

//现在角色在进行对话时依然可以进行移动，是通过inputmanager控制的。我现在还能改变角色的状态，但是不能修改Move状态了。

现在当角色与npc在interact的状态下才能进行进一步对话。换句话说，不挨着NPC就不能让对话继续进行。

跳过对话功能

```json
"firstMeet" :[

[["TalkingCharacter" : "Instro"], ["DialogPattern": "Normal/Thinking/Shocking"], ["Pose" : "Normal/Happy/Shocked/Frightened"], ["FocusPoint": "Instro","Player"], ["PopUpEffect":"Fade","Shock"], ["Sentence": "Nice to meet you!"]],

[["TalkingCharacter" : "Player"], ["DialogPattern": "Normal/Thinking/Shocking"], ["Pose" : "Normal/Happy/Shocked/Frightened"],["FocusPoint": "Instro","Player"], ["Sentence": "Nice to meet you, too!"]],

[["TalkingCharacter" : "Instro"], ["DialogPattern": "Normal/Thinking/Shocking"], ["Pose" : "Normal/Happy/Shocked/Frightened"],["FocusPoint": "Instro","Player"], ["Sentence": "Glad to see a new face here"]],

[["TalkingCharacter" : "Player"], ["DialogPattern": "Normal/Thinking/Shocking"], ["Pose" : "Normal/Happy/Shocked/Frightened"],["FocusPoint": "Instro","Player"], ["Sentence": "I know you before."]],

[["TalkingCharacter" : “Instro”], ["DialogPattern": "Normal/Thinking/Shocking"], ["Pose" : "Normal/Happy/Shocked/Frightened"],["FocusPoint": "Instro","Player"], ["Sentence": "Shocked! Then do you know Onstro over there?"]]

[["TalkingCharacter" : “Onstro”], ["DialogPattern": "Normal/Thinking/Shocking"], ["Pose" : "Normal/Happy/Shocked/Frightened"],["FocusPoint": "Instro","Player","Onstro"], ["Sentence": "I don't know him!!!!"]]

[["TalkingCharacter" : “Instro”,"Player"], ["DialogPattern": "Normal/Thinking/Shocking"], ["Pose" : "Normal/Happy/Shocked/Frightened"],["CameraFocus": "Instro","Player"], ["Sentence": "......"]]

]
```

测试-角色交替对话，不同表情，同时对话。

Player can trigger conversation with a NPC when pressing interact button near an interactable NPC, and there will be a dialogue box on the talking characters‘ head to show who is talking. The dialogue texts are stored in a JSON file so that other team members can modify it easily. So this is the basic function we have implemented so far.

```json

[["TalkingCharacter" : "NPC1"], ["Pace": Slow], ["DialogPattern": "**Normal**/Thinking/Shocking..."], ["Pose" : "**Normal**/Happy/Shocked/Frightened..."], ["CameraFocus": "NPC1"], ["Sentence": "Rock..."]],

[["TalkingCharacter" : "Player"],["Pace": Slow], ["DialogPattern": "**Normal**/Thinking/Shocking..."], ["Pose" : "**Normal**/Happy/Shocked/Frightened..."], ["CameraFocus": "Player"], ["Sentence": "Paper..."]],

[["TalkingCharacter" : "Player", NPC1"], ["Pace": Fast,Fast], ["DialogPattern": "Normal/Thinking/**Shocking**...", "Normal/Thinking/**Shocking**..."], ["Pose" : "**Normal**/Happy/Shocked/Frightened...", "**Normal**/Happy/Shocked/Frightened"], ["CameraFocus": "Player","NPC1"],  ["Sentence": "Scissors!", "Scissors!!!!"]],
```

Check  X  Question

上面这三行是一个假设的场景举例，两个人在玩石头剪刀布的游戏，程序会一条一条读取，也就是按下按键时游戏就会进行到下一句话，并根据不同的关键字调整当前的视觉相关内容。例如第一句话，实际效果是，NPC1头上有对话框，语速为慢语速，对话框样式为Normal，摆出正常姿势，摄像机跟随着NPC1，NPC1头上的对话框出现的文字是"Rock..."。而第三句话的实际效果是，Player和NPC1头上都有对话框，语速均为快语速，对话框均为“Shocking”样式对话框，姿势均为Normal，摄像机跟随的位置是Player和NPC1的中间位置，并且两个人头上的对话框内容分别为"Scissors!"和"Scissors!!!!"

"TalkingCharacter"：代表这一句话是谁讲出来的，如果有两个或以上的名字的话就是这些人同时在讲话。目前已经完成的基础版本的对话系统只有被触发的NPC会说话，而实现了这个功能后则可以让一段对话中有不同的人说话。对话框也会出现在对应名字的角色头上。如果不进一步开发的话则只有角色触发的那个NPC可以对话。

"Pace":代表角色的语速，也就是文字出现的速度。在目前已经完成的基础版本的对话系统中角色的一句话是一瞬间全都出来的，如果实现了这个功能之后则角色的话是根据语速一个字一个字出现的，需要跟TalkingCharacter一一对应。如果进一步开发的话有两个需要开发的功能，一个是让字一个一个弹出的功能，另一个则是让字弹出的速度也就是Pace，目前角色说的话都是一瞬间说话一句话。

“DialogPattern”: 代表对话框的图案，以表示这句话是角色正在思考的内容或者是普通的说出，如果前面TalkingCharacter有不止一个角色的话，这里也需要按照对应的角色给出DialogPattern。如果不进一步开发的话则角色说话永远都是同一个对话框。

"Pose": 代表对话时该角色的形象姿势。角色在对话时会摆出思考，快乐等等不同的姿势，通过这个关键字来更改角色在说这句话时的姿势，同样的，如果前面TalkingCharacter有不止一个角色的话，这里也需要按照对应的角色给出DialogPattern。如果不进一步开发的话则角色说话时不会有任何变化。

“CameraFocus”: 代表对话时摄像机的位置。根据名字来指定摄像机应该跟随哪个角色，如果填写了多个角色的话，则计算这些角色的中间位置。也可以设置一些非角色或者不可见的目标以控制摄像机点位。不用与TalkingCharacter一一对应。如果不进一步开发的话则镜头默认始终跟随着Player。

"Sentence":角色说的话的内容，代表角色说的话的内容，需要跟TalkingCharacter一一对应。

这是目前我设想的有关对话的因素(除了TalkingCharacter和Sentence是确定的)，当然这些只是预计实现的效果举例，具体是什么样的效果由其他人决定，除了其中的“TalkingCharacter”和"Sentence"是必须的以外其他的根据需求可能并不是必须的。可以先不急着确定要保留哪些或者是要删去哪些，不确定的话也可以先留着，之后再做决定，因为没有对应实现方法的变量不会影响任何事情，就放在代码里不会影响任何事情。以及如果有想给对话增加效果的话也可以告诉我，例如其他的可能效果还有例如对话框出现消失时的特效(例如淡入淡出，瞬间出现消失等)，文字的特效（例如文字会抖来抖去，上下起伏等），对话框不跟随角色而是自行移动等等效果，根据需求之后可以进行进一步开发，以上了"TalkingCharacter"和“Sentence”是必须的以外都是只是举的例子。如果可以明确下来这些开发任务的话我就可以专心开发优先级最高的任务而不是一直乱想我应该实现怎样的框架，毕竟实现一个效果还是需要花费一段时间的。

These three lines are an example of a hypothetical scenario where player and NPC are playing the Rock, Paper, Scissors game. The program will read line by line, meaning that when a button is pressed, the game will proceed to the next line of dialogue. It will adjust the current visual elements based on different keywords. For example, in the first line, the actual effect would be that NPC1 has a dialogue box above their head, the pace is slow, the dialogue box pattern is Normal, the NPC1 assumes a normal posture, the camera follows NPC1, and the text appearing in the dialogue box above NPC1's head is "Rock...". As for the third line, the actual effect would be that both Player and NPC1 have dialogue boxes above their heads, the pace for both is fast, the dialogue boxes are "Shocking" pattern, both assume a normal posture, the camera follows the midpoint between Player and NPC1, and the content in the dialogue boxes above their heads is "Scissors!" and "Scissors!!!!" respectively.

"TalkingCharacter": Represents who speaks the sentence. If there are two or more names, it means those characters are speaking at the same time. In the current basic version of the dialogue system, only the triggered NPC can speak. However, implementing this feature would allow different characters to speak in a conversation. The dialogue box will also appear above the corresponding character's head. If not further developed, only the NPC triggered by the player can talk in each dialogue.

"Pace": Represents the speech pace of a character, which is the speed at which the text appears. In the current basic version of the dialogue system, a character's line appears instantly. Implementing this feature would make the character's dialogue appear letter by letter according to the speech pace. It needs to correspond one-to-one with "TalkingCharacter". If further developed, there are two functionalities to be developed: one is to make the text appear letter by letter, and the other is to control the pace at which the text appears. Currently, characters speak their lines instantly.

"DialogPattern": Represents the pattern of the dialogue box to indicate whether the character is thinking or speaking normally or other. If there are multiple characters specified in "TalkingCharacter", the "DialogPattern" needs to correspond one-to-one with "TalkingCharacter". If not further developed, all characters will always use the same dialogue box pattern.

"Pose": Represents the pose or gesture of the character in each line. Characters may assume different poses or expressions such as thinking or being happy while speaking. This keyword changes the character's pose during the specific line of dialogue. Similarly, if there are multiple characters specified in "TalkingCharacter",  the Pose" needs to correspond one-to-one with "TalkingCharacter". If not further developed, there won't be any changes in the character's pose during dialogue.

"CameraFocus": Represents the camera position during the dialogue. It specifies which character the camera should follow based on the name of character. If multiple characters are specified, it calculates the midpoint position among them. Non-character or invisible targets can also be set to control the camera position. It does not need to correspond one-to-one with "TalkingCharacter". If not further developed, the camera will always follow the player by default.

"Sentence": Represents the content of the character's dialogue. It corresponds to what the character says and needs to match "TalkingCharacter" one-to-one. 

These are the current factor  related to dialogue that I have currently envisioned(while “TalkingCharacter” and “Sentence” are definite). However, please note that these are just examples of anticipated effects, and the specific implementation and effects are up to you guys. Apart from "TalkingCharacter" and "Sentence," which are required, the other variables may not be necessary depending on the requirements. 

We don't have to rush to determine which variables to keep or remove. It's fine to leave them undecided for now and make decisions later. Those variables that don't have corresponding implementation methods won't affect anything. If we have any ideas to enhance the dialogue with additional effects, such as special effects when the dialogue box appears or disappears (e.g., fade in/out, instant appearance/disappearance), text effects (e.g., text shaking, moving up and down), or dialogue boxes moving independently instead of following characters, we can consider further development based on the those requirements. Except for "TalkingCharacter" and "Sentence," which are essential, the other examples mentioned are just for reference. If we can clarify these development tasks, I can focus on working on the highest priority task instead of thinking blindly about what I should do to build the framework to respond to uncertain requirements. After all, implementing a specific effect does require a significant amount of time.

选择支线
文字标亮
角色名称出现在对话当中

 <br/>

提前把所有角色都存储在dialogManager当中，然后通过名称将其添加在List当中，然后生成对话框？
通过名称来让dialogManager获取角色组件并且添加在List当中，然后生成对话框？（这个似乎更好一些，不用添加太多的角色，可以通过代码来自由获取角色物体，并且只需要保证json里和unity内部的名字一致即可。但是每一次读取都要重新加载角色，可以在一开始的时候写下一个"Included Character"提前获取好所有角色添加进List当中，然后在读取的时候从List当中读取。）
用这种方法的话，就把要触发的对话绑定在NPC身上，然后读取对应的对话即可。

 <br/>

怎么调用对应的对话？根据角色自己的状态还是。。。  根据自身的状态好了，但是这样很难修改特定的对话
对话完之后修改自己对应的下一段对话？ 在对话文件中修改下一段对话？CurrentConversation  NextConversation，这样的话在触发了特殊的对话的话也可以回到某一个对话，感觉挺复杂。

[["current":"1"],["Next":"2"],["1":zxcasd]],[["current":"2"],["Next":"3"],["2":[zxcasdasd]]

 <br/>

首先根据名称找到对应的角色，然后添加到一个map当中，key为名字，value为编号，并且通过map给名字添加编号

List<Gameobejct>

map<string, Gameobject>

map.getKey("NPC")

 <br/>

让角色进队列的方法用map来查找↓，读取json里面的talkingCharacter获取string，作为key值查找value即可。

在每次点击E时进入一句新话语时，先遍历sentences当中的talkingCharacter，把角色的gameobject进链表，然后让之后有关绑定角色的方法函数全都挨个根据队列绑定，例如SetDialogBox，SetDialogBoxPattern，SetCharacterPosutre之类的。出队列的循环全都放在函数体内部进行。对于SetDialogBox，每次让角色循环出队列都进行如下操作：

```c#
currentDialogBox = Instantiate(dialogBoxPrefab,uiCanvas.transform)
currentDialogBox.GetComponent<DialogBox>().IntializeDialogBoxxxxxxxxxxxxxxxxxxxxxxx
this.conversationText = currentDialogBox.GetComponent<DialogBox>().conversationText;
```

再给每个角色生成dialogBox的时候，也要将对应的文本赋值给dialogbox，也就是conversationText这个东西

先删除再清表

每一次点击Z的时候，先清楚所有的表，然后删除，之后若是索引已经结束的话，就结束对话，触发结束对话事件，如果索引没有结束的话，就读取表。

因为删除的时候会延时一小段，导致程序会在set之后再删除，怎么办！

动画逻辑好像不太对，第一次对话的时候按Z立刻生成，然后按Z延时播放消失动画，消失完毕之后生成新的对话，然后结束等待对话消失调用对话结束事件

按Z立刻生成对话，按Z对话立刻生成对话开始消失，过一会对话消失结束。  啊呀那要每次设置开始新对话的时候都要生成一个新的链表才行。

哦等等，为什么不让对话框自己把自己给删了呢！都快忘了！

清除角色，清除

重构了对话系统的代码结构，让功能之间解耦，让框架更容易被扩展新功能，以应对之后的开发需求。改进了对话文本的结构，让策划们能够更加细致的调整对话状态时的内容。

一场对话可以包含任意数量的角色参与到对话当中，并且如果有特殊情况的话，角色可以同时讲话。

根据状态或者条件，可以触发不同的对话，例如图中玩家和NPC游玩了石头剪刀布之后，再次触发对话，就会触发另一段想不想要重新游玩的对话。然后再次进行一段石头剪刀布的对话。

添加了有关对话系统的动画。让视觉看起来更流畅

 <br/>

为了应对之后的开发，提高效率，也更容易扩展新功能，对话系统的程序结构被重构了。此外，也改进了文本的结构，让策划可以更细致的调整角色对话时的状态和内容。 
目前对话系统有两大主要功能，如图所示，一场对话可以包含任意数量的角色参与到对话当中，并且可以让他们在同一个时间内说话。此外，根据状态或不同条件，同一个角色会触发不同的对话，例如图中玩家和NPC游玩了石头剪刀布时，他们可以同时说出剪刀，并且再次与NPC触发对话时，就会触发另一段NPC询问玩家是否要再进行一次游玩的对话，之后再回到游玩剪刀石头布的对话当中。并且，也有第三个在画面外的角色参与到对话当中，它的对话框会保持在画面内让玩家看到。

对于之后的开发，我们会为对话系统添加更多的功能，例如关键字会被高亮，可以显示角色正在思考还是尖叫的不同的对话框样式，以及在说话时可以改变角色的姿势以及和其他系统的联动等等新功能，这将取决于我们之后的开发进度和需求来调整不同功能的必要性和优先级。

以及，添加了一些动画让游戏看起来更流畅。

 <br/>

 <br/>

添加一个功能：让角色在每次对话时能够随机加载一段预设对话。

 <br/>

接受任务——开启接受任务界面，图钉是固定的，如果该位置有任务的话，排序一下，让对应图钉下的image激活，播放动画，上面的文字则读取JSON文件。点击E之后将播放image被取下的动画表示任务被接受。如果有超过十个的任务，它将不会出现，知道玩家接受了其中一个任务，则会填补其中的空缺。

提交任务——

对话——

离开——

打开对应的界面之后，要切换操作

在说的话的时候添加emoji

添加任务manager，让playerManager读取任务manager的内容，让任务manager为单例。

注意，我只在酒馆里添加支线任务，不添加主线任务。

所以mission finder是用来找allMission里面的内容的。

让任务数据存储在MissionManager当中，接取任务，完成任务都会更新MissionManager当中这些东西的数据
从大地图进酒馆的时候，player会消失，tavern从manager中读取数据，然后在接取任务和完成任务的时候更新MissionManager的数据。
从Tavern到大地图的时候，player会生成，读取missionManager的信息。所以每次player更新任务的时候都要让missionManager来管理任务进度。那道具怎么办？

同理，让InventoryManager来读取，tavern读取storagemanager的内容，player生成的时候从中读取数据即可。

所以每次切换场景的时候 引用都会丢失，需要在start里重新引用。

那么其实只要在角色OnDestroy的时候更新一下MissionManager的状态就可以了。

所以其实就是有两种condition，一种是前置任务，一种是等级。完成任务的时候会执行completedMission，遍历一遍allMissionsInfo，如果有前置任务和当前任务名相同的任务的话，就把它加入到available任务当中。玩家升级的时候，也遍历一遍AllMissionsInfo，如果有和当前等级相同的任务，就把它加入到avaliable当中。 然后到指定地点触发acceptedMission，把对应名字的avaliable任务添加到activeMission并移出avaliable任务。（这个方法是遍历一遍所有的availableMission，然后挨个加进去，如果名字与领取的任务是同一个的话，让状态为true并且直到遍历完成之前都会直接添加下一个任务而跳过这个任务，从而避免当前添加领取了的任务。 那数组怎么不会越界？）

关于levelup，有个bug，就是每次Levelup都会重新生成之前的那个avaluable 任务

不过倒是给了我一个想法，就是在tavern里，Accept界面里面，只要读取所有的available的任务到板子上就好了，点击之后就扔进acceptedMission即可，很轻松。

耦合度好高好难改！

改好了

点击Accept任务选项时，active任务界面弹出，执行start方法，将available的任务都填充进去，也就是说，读取available任务数量，然后激活对应的image，然后读取json文件来将任务描述填充上去即可。

Pin时刻存在，quest的backGround则随着available任务列表改动

因为available 列表里是存放的是string，所以要根据其数量来激活对应数量的questBoard List，同时根据string名称来获取对应的任务描述

在accept任务界面里，上下左右移动图标，按E点击领取任务，任务消失，如果有新的任务的话则将该任务填充进去。

先通过MissionFinder读取任务种类名字和数量，然后根据先读取对应名字的种类进行其对应数量的遍历，将文件夹内的任务全都读取到allMission当中。 然后将allMission都转成数组存放在allMissionInfo当中，之后接任务的时候根据名字将任务添加进activeMission当中（只是任务名而已），并删去avaliableMission当中的任务名字。所以我要做的是，根据任务名字，找到对应的任务文件，然后读取其中的description

所以每个任务信息都在allMission里面，只需要遍历allMission.name即可 

搞好了，接下来做次级菜单，按下E之后弹出更详细的内容。

添加一个buffAvailableMissions，读取前十个AvailableMissions。buffAvaiableMissions应当是missionInfo类型，这样可以传递给detailedQuest当中。

 <br/>

啊啊啊啊出事，原来这个input Event只是一个键盘到游戏的映射，想要让物体停止运动的话需要将其注册事件取消才行。

好像也不是，把对应的输入input disable掉就好了，虚惊一场，但为了保险起见我也在对应的disable和enable的地方让输入事件也注册和取消注册了。

其实删了之后已经自动排序了，现在的问题是消除对应的那个任务时不会让那个任务的backGround消失

 <br/>

删除了一个任务之后，buffList会自动排序，如果这样的话，从视觉上来看，删除了2，后又补充了2，实际上删除了2，2之后的所有内容都01，新补充的2其实是9。目前使用的索引值是通用的，上限为buffList的大小，
两种方法，一种是让图片索引值和实际任务索引值分开为两个进行操作，我删除了一个buffList之后，实际任务索引值会变小，

现在的方法是，删除索引之后添加一个Index，之后在每次move的时候都会比较索引值进行处理。这样的话，每次接收任务时就不用删除对应的索引了，且如果按下E的时候当前的索引是被标记为删除的索引，则不执行操作。之后在每次删除的时候也要先看一下是否有新任务补充，如果有的话则不添加删除索引并更新bufferList

搞好了

旁白和酒馆是同一个样式，酒馆里kilg说话就改变一下名字。大地图上说话还是出现在头上，并且包含头像和名字。

I modyfied the dialogBox pattern and it looks like this now. The left contains a frame and an image for character's head. And the part below that contains a frame and the text for character's name. The right is as usual, the content said by the character.

**the camera : in the town, Z= -7, original field of view: 60, talking field of view: 30, speed: 8  ;  in the wild, Z=-11, original field of view:60, talking field of view:40(may change) speed: 12**

[坐标系转化 | Unity简明教程 (gitbooks.io)](https://li-kang.gitbooks.io/unity-concise-course/content/Summary/coordinate.html)

对话触发条件，触发了对话之后让角色自己改变状态如何？

我又应该有多少种NPC的状态？又如何在对话完之后触发对应事件呢？

写一个事件管理器？发生事件之后，改变状态？

第二次进入酒馆的时候有bug，再次对话的时候会出一个已经被删除了但是还要access这个问题，似乎是没clear成功导致的。

修好了，实际上是没有取消注册事件导致的。

 <br/>

事件系统，对话系统

让对话以堆栈的形式存储，默认对话存在最低端，若有特殊对话的话则将其添加到最高层。但是有个问题：若是在添加之后玩家又不满足对话条件了怎么办，没有办法将下层对话拿出来删除。

任务牵扯到NPC类，
NPC类包含NPC对应的任务类，对话文本，对话触发条件，并注册对应的事件。对话包含触发条件，任务类包含触发条件，完成条件。
事件影响NPC对话触发条件，并且修正角色对话文本

静态事件类，事件包含触发事件的触发器方法。
事件触发完成之后不再重复触发。

静态事件类只包含事件，跟事件有关的脚本通过静态事件类注册事件。一旦事件触发，所有人触发自己的对应事件handle方法。

静态任务类，跟任务有关的脚本通过静态事件触发任务的Start相关函数，并且在对应的方法中处理相关参数，例如角色当前对话等，任务类内部则包含任务进行情况，例如isMission1Start之类。

对话结束触发任务？

在某脚本中

```c#
triggerMission1=>{event.triggerMission1StartEvent}
triggerMission1StartEvent->InvoketriggerMission1StartEvent
HandleTriggerMission1StartEvent=>{missionManager.Mission1Start(),curDialog = 1}
HandleTriggerMission1StartEvent=>{missionManager.Mission1Start(),curDialog = 2}
Mission1Start()->missionManager.Mission1Processing = true;


triggerDialog => {event.triggerDialog}
```

把触发对话的NPC传递过去，播放角色当前cur对话，在对话结束时，传递角色引用，如果是自己的话，再triggerMissionEnd？我怎么知道当前正在进行哪个任务，并且终止该任务？curMission = mission？MissionManager来结束当前主线任务？
解耦！不绑定任务开始和任务结束，在特定情况下执行MissionStart 在特定情况下执行MissionEnd，但是执行missionStart的条件会比较分散，需要在特定的脚本中执行，但是触发MissionStart的函数由事件触发，并且会改变对应的参数

 <br/>

对话开始，对话结束事件。任务开始，任务结束事件。
（任意事件，例如某任务结束，某对话结束，某两个任务结束等）->任务开始-对话变为正在进行任务->(任意事件，例如材料足够，离开某个地区，进入某个地区，某对话结束)->任务结束->(角色对话改变，)->任务开始

```c#
class event  
Invoke event1 event2 event3;
TriggerEvent1()
TriggerEvent2()
TriggerEvent3()

class Kilg : NPC
Mission mission1;

Register event1
mission1.OnComplete()
{
	event.TriggerEvent1()
}
HandleEvent1()
{
	curDialog = 1;
	mission2.OnStart()
}

class Slime : NPC
Register event1
HandleEvent1()
{
	curDialog = 2;
	mission2.OnStart()
}
```



IsFirstlyMetWith_xxx

IsFirstlyEnterTavern

IsFirstlyLeaveTavern_xxx

AcceptedQuestInTavern->Effect on the dialogue of the Master Rabit

SubmitQuestInTavern->Effect on the dialogue of the Master Rabit

IsMission_x_avaliable

IsMission_x_inProgress

IsMission_x_completed



```json
{
  "story": true,   // Used for indacate whether it is story quest or side quest.
  "name": "Under the water",   // The quest's name, also used for program to read the quest json file.
  "description": "I'm ready to go underwater now let's finish this thing.", //Description for quest, it will appear at the quest interface, accept quest interface and submit quest interface in tavern.
  "Objective": {

    "description": "Reach the underwater thing",   //Description for objective, it will appear at the quest interface.
    "objectiveList": [
      {
          "conditionName": "Reach the underwater thing", // Detailed objective for quest, it used for list out the objectives one by one in the detailed quest information interface.
          "number": 0  // 0 stands for empty, if the objective is "Reach someplace" or "Talke to somebody", then the number should be 0, if the objective is "Collect something", then fill the number here.
      }

  ]

  },
  "Condition": {      // The condition to unlock the quest.  This part is made by Paul and it's still in progress.

    "conditions": true,   
    "locationBased": false,
    "previousMission": "Story 9",
    "obtainedItem": "Spirit Diving Scooter"

  },
  "Reward": {

    "description": "50 EXP",  // Description for reward, it will appear at the quest interface.
    "exp": 50,
    "rewardList": [    // Detailed objective for reward, it used for list out the reward one by one in the detailed quest information interface.
      {                // Each reward in rewardList should contain: rewardName, rewardNumber and rewardIcon(if we have the Icon). If the reward is something like "unlock recipe", then the rewardNumber should be 0.
          "rewardName": "exp",
          "rewardNumber": 50,
          "rewardIcon": "exp"
      }

  ]
  }

}
```

Dialogue1EventArgs存储对话文本所需要的数据，例如对话角色名称和对应的索引值等

内部有NPCName和CurrentDialogIndex，绑定在一起

Event1Publisher内部有多个事件，例如：
Quest1Publisher内部包含：Quest1Start，Quest1End，Dialog1Start，EnterTavern，LeaveTavern等。
在Quest1start(Args)，内部触发Quest1Start?.Invoke(this, new Args )之类的包含与任务相关的参数。在使用的时候，例如在Kilg文本内部，调用Quest1Publisher.Quest1Start(Args),就可以触发该事件，所有内部有quest1Listener的NPC都会接收到这个事件，在quest1Listenner内部执行HandleQuest1Start 并且拿到Args

酒馆对话管理有那些EableInput的话，就会导致出tavern的时候出bug，如果没有的话，酒馆里面的对话就会无法更新头像，只能调用dialogManager的那些东西。

publisher发布任务之后，触发了QuestStart，然后将Args内部存储的数据传递给各个订阅者。例如，DialogueEventArgs内部包含了名字和对应的对话文本，然后出发了QuestDialogue之后，内部将根据传递进来的对象名称读取DialogueEventArgs中与对应名称相对应的Dialogue索引，并且返回。

1.内部存储的是name-curDialogIndex这样类似的键值对。
2.将Args内部存储的数据一一对应起来，实例化为DialogueEventArgs1，DialogueEventArgs2等，包含不同的
2.？ 创建不同的DialogueArg类，让类内部保存不同的数据，并且根据JSON文件读取。

逻辑嘛很简单，出了tavern就让kilg发送触发Quest1End事件信号，大家handle一下，改改自己的Dialogue号，然后注册Story2Publisher，然后触发Sroty2Start事件，加个任务啥的。
还有一个问题，让酒馆不再出现主线任务。

 <br/>

我要干啥来着

加事件，让交接任务做一个事件，让missionManager更新并追踪，修酒馆，让第一次进酒馆变成真的事件

任务2：出了酒馆给玩家合成工具的材料和合成工具的蓝图。(完成)
			做完蓝图出去任务结束，触发任务3

任务3：
任务3进森林，捡材料，捡起来就比较一次是否满足条件，检测背包，满足条件结束任务3。 
玩家自主打开蓝图修房子

修房子：
在任务1的时候就接到任务，完成蓝图后修完房子之后满足修房子事件，交任务出门触发任务4

任务4对话完给玩家所有蓝图。(完成)

在submit interface中修改了awake和onenable的问题，延时了一帧
[OnEnable before Awake?? - Unity Forum](https://forum.unity.com/threads/onenable-before-awake.361429/)

需要在事件里面读取json文件，或者手动输入就行，存在Arg里，每次升级，都检测一下是否有符合条件满足的蓝图可以解锁，或者是按顺序读取，记录index即可。

在arg里存在List里就行

升级系统 角色等级提升时触发事件。打开UI并显示解锁的东西

要注意的是，让所有的任务奖励都在触发完对话或在提交完任务后再给。此外，也有可能在tavern中升级，所以应当disable掉所有其他的输入并启用自己的输入。 可以用鼠标或键盘关掉界面，并清除所有的listnode，恢复所有被关闭的输入，得记录下来。 做好了

角色触发talk in tavern的时候，本应该在出了tavern才出现的goblin 2却直接出现在了tavern列表里，这倒是给了我一个很大的启示，修bug

 <br/>

改了zach town里面的FakeTavern的选择的碰撞大小-通过添加一个collider的gameobject的方式

改了很多的tavern里面的东西，submit按键加了脚本，其他的也多少有加了引用啥的。

给每个dialog添加prefab，

给每个NPC都添加了自己的dialogBoxPrefab，拖到对应的脚本上去就行

改了自己的openingCutScene的order，改成了49，因为跳转效果order是50
玩家不接任务的时候不能修房子，没有获得permission

酒馆对话框长宽为1555.24，291

Level UP    mouse control in tavern    

I have imported the dialog box assets and it looks so great in the town, but in tavern there is some problems.

The first is that the resolution (or the size) of the dialogbox in tavern is low, so that it looks very small in tavern. Could you re-export that with higher resolution? The higher the better. As reference, the size of the dialogbox background is 1555 × 291.
The second is that the scraching problem. Sorry I didn't explain well before. These four parts shows in the first picture will be scrached like the second picturer shows, so I think you can leave an blank gap on those four parts, like the third picture shows, And it will looks like the fourth picture shows in the actual game, the pattern on these part will be separated.

And there is another problem of the sprite of Master Rabiit. I am so sorry that I didn't clarify this before. The size of the walking character in world map and the character image in tavern is different.  The size of the Master Rabbit it 256×256 now, which is suitable for those chracter in the world map but not suitable for the image in the tavern which should be more detailed and higher resolution.(Sorry I tried to explain this, hope you can understand what I mean), yeah so in a word, could you please re-export the sprites of the Master Rabbit, just make the resulotion higher? The higher the better. Just make sure the ratio is 1:1. It looks blurry in 256×256. I think 1024×1024 ore little higher is suitable maybe?

修改了tavern里面选择项的assets和字体，修改了升级的字体，修改了对话字体
修改了tavern里面接任务界面的字体，提交任务界面的字体。

 <br/>

修改了酒馆里的主界面布局，submit界面的退出icon，关闭了tracing box，森林里添加了minotaur start，森林里给crystal加了bombcrystal脚本，变成了interactable

 <br/>

玩家持有两个蓝图且刚出森林

1.如果玩家已经有个两个木板，直接追踪木桥蓝图

2.如果玩家没有两个木板，则先追踪木板再追踪木桥蓝图

 <br/>

木板：Gather wood to craft Wooden Board
木桥：Use Wooden Boards to fix wooden bridge

改了Cube 18的碰撞体，加了各种tracing box

 <br/>

偷偷添加了作弊按钮

[详解C#中的反射 - 咖啡无眠 - 博客园 (cnblogs.com)](https://www.cnblogs.com/jiangyunfeng/p/10436520.html)

[【Unity3D日常开发】Unity3D中 C#反射Reflection的使用_51CTO博客_Unity反射](https://blog.51cto.com/itMonon/5256345)

[Unity C#基础之 反射反射，程序员的快乐 - 简书 (jianshu.com)](https://www.jianshu.com/p/2f0cfdf116c8)
[C# 反射总结 获取 命名空间 类名 方法名 - Rocken.li - 博客园 (cnblogs.com)](https://www.cnblogs.com/xdot/p/8651506.html)

按某键自动收割周围木头啥的

改了酒馆里的detailedQuestBoard，别忘了改Cube 18的碰撞体

改了MissionScreen里面的东西，例如Side Mission 里面的Text，width改成了230，还改了active quest里面的 QUest Objecttive改成了居中。
加了一个水晶珠

在开发期间，我的主要职责在游戏的对话系统，酒馆系统以及事件系统上，主要与叙事以及游戏整体流程有关。此外，还对一些UI画面效果有一定贡献。

So the development area I mainly focused on are Dialogue system, tavern system, quests and event systems, which are mainly about the narattive and game process. In additional, i also contributed to some UI visual effect.

 <br/>

During the course of development my focus has primarily lied on the development of specific gameplay mechanics, shader implementation, the expansion of our audio system, and our core “blueprint” system.

玩家在酒馆或者野外中发生对话与在酒馆中的对话效果并不同，但两者都会根据游戏进程或不同条件产生变化，对话被存在外部JSON文件中，易于修改。每个角色都会根据角色生成属于自己不同的对话框样式。在对话时也会取消其他UI，生成效果并且让摄像头缩进。

The dialogue in the tavern and outside are different, but both of dialogue texts are stored in the JSON file, which is easily modified. I created a dialog manager to manage these dialogs, such as reading who triggered the dialog and reading the corresponding dialog text as well as looking up the dialog text by index, and adding various dialog effects, such as dialog positions, patterns, camera effects, UI effects, and so on, which can be changed according to each different line of dialog.

在酒馆中玩家可以做很多事，当列表中有任务时可以领取任务，领取之后的任务在完成之后可以提交并获得经验值以及材料或者新蓝图等的奖励，玩家还可以在酒馆中与NPC对话，每次对话的内容都会有所不同，直到重复。此外，玩家还可以在酒馆中自由使用键盘或者是鼠标进行操控。

Player can do several things in tavern, when there is quets in the avaliable lists then the player can accept that quest, and can submit that quest and claim rewards like experience, meterials, new blueprints etc. Player can also talk to the NPC in taver, Each conversation will be different until it is repeated. In addition, the player is free to use either the keyboard or the mouse to select in the tavern.

我实现了所有任务的目标和奖励。我们有很多任务，每种任务的完成方式和奖励都不尽相同，例如修复特定房子，获取足够材料，探索区域并调查某个东西，与某人对话，完成某个特定蓝图等等，不同任务也会给予不同的经验奖励，材料或者是蓝图以及解锁新的任务等多种不同的奖励。

And I also implemented all of the objectives and rewards of the quests. We have a lot of quests and the objectives and rewards are different for each quest, such as fixing a certain building, collect enough materials, exploring a new area and investigating something, talking to someone, completing a specific blueprint, etc. Different quests also give different experience rewards, materials or blueprints as well as unlocking new quests and many other different rewards.

此外，我实现了一个事件系统以便于管理游戏进程和代码，并且这个事件系统可以让各个系统产生不同的交互，让我们的蓝图系统，道具系统，对话系统等等大部分系统都联系起来。游戏中的每一个事件都会有不同的影响，例如对话，完成蓝图，到达某个地方，离开酒馆等等会触发新的任务或结束任务，任务结束又可能会触发另一个任务或事件，改变NPC的对话文本，又或者是奖励或移除玩家相应任务道具，触发新的特定事件等等，让游戏可以逐渐推进并抵达结局。

Additionally, I implemented an event system to easily manage the game progress and the codes. This event system can make different systems interact with each other, make connection between our blueprint system, iventory system, dialog system and most of systems.
Every event in game may have different impact, for example, a conversation, completing a blueprint, arriving a certain place, leaving tavern, etc.  will trigger an event, and this event may trigger a new quest or end a quest, or event another event, change the  text of an NPC's dialog, or reward or remove the player's item, triiger a new conversation, etc., so that the game can progress gradually and arrive at the ending.

Additionally, I implemented an event system to easily manage the game's progress and code, and this event system allows for different interactions between the various systems, allowing us to link most of the blueprint system, the prop system, the dialog system, and so on. Every event in the game has a different impact, for example, a conversation, completing a blueprint, arriving somewhere, leaving a tavern, etc. will trigger a new quest or end a quest, and the end of a quest may trigger another quest or event, change the text of an NPC's dialog, or reward or remove the player's appropriate quest item, trigger a new event, etc., so that the game can progress gradually and arrive at the ending.

