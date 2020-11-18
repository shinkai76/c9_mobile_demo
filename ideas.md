- 我们的筛选条件有些比较复杂，不是仅有一个input或一个select，感觉像如下这样实现，也能够实现过滤组件的复用。父组件传filterItems对象，子组件根据item.type渲染对应元素，如果type包含'&',说明此项较为复杂，对type进行解析，比如\[商品包含/仅包含]是一个下拉框+一个input输入框，那么希望type结构类似select&input——这样子组件解析后自动渲染一个\<select>和一个\<input>
-------------
  
- 关于下拉选择，觉得十个以内的选择比如发票类型，考虑直接用\<select>在安卓上是一个模态框，在iOS上是底部的滑动选择区域。超过十个，比如仓库和商品，最好是单独一个选择页面，这样无论是放搜索框还是懒加载或者页码分页都有空间。
--------------
- 移动端的界面效果最低适配iPhone5(320x568)