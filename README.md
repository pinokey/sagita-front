
# sagita


## About project
NFTコレクション同士の依存関係（オリジナル作品と二次創作と関係性）の情報を投票を用いてブロックチェーン上に蓄積し、その情報を視覚的にわかりやすく表示するサービス。
MVPとしては
1. 親と子の関係をコントラクト上に追加する機能
2. その関係についてステークホルダーがapprove機能
3. それをビジュアライズして表示し探索できる機能（このようなグラフ形式でコミュニティを可視化し、探索できるようにする）
を予定している。

A service that uses voting to store information about dependencies between NFT collections (relationships between original works and secondary works) on a blockchain and displays this information in an easy-to-understand visual manner.
The MVPs include
1. the ability to add parent-child relationships on the contract
2. the ability for stakeholders to approve the relationship
3. a function to visualize, display, and explore the relationship (visualize the community in such a graphical form so that it can be explored)
The plan is to have the following features
![](public/FT1g-eGakAEvpKh.jpeg)

## Problem and Solution
NFTコレクションにおいて、二次創作とオリジナル作品が相互にコミュニティを盛り上げている一方で、このような関係性はコミュニティが成熟するほど複雑になり、新規参入者にとって理解しにくくなる、そこで二次創作とオリジナル作品の関係性をビジュアライズすることで新規参入のハードルを下げ、二次創作によるネットワーク効果を高める。
CC0の作品が増えていく中で、nft同士の関連性がgraphで見えるようになったらめっちゃ最高やん！！
今は、売り上げランキングだったり、中央集権的な二次創作リストしか存在しない

In the NFT Collection, while derivative works and original works mutually enliven the community, the more mature the community becomes, the more complex this relationship becomes, and the harder it is for newcomers to understand. Therefore, visualizing the relationship between derivative works and original works lowers the hurdle for newcomers and enhances the networking effect of derivative works.
As the number of CC0 works increases, it would be great if the relationship between nfts could be seen in graphs!

## 使用した技術
contract address: 0xbc9482466Ab7a2842311Ae3E4832dBaB62F4b20F（mumbai testnet）

## demo
https://youtu.be/r8fL9tavGgw

## hard things?
・１つのNFTコレクションに対して１つのコントラクトアドレスがあるという仮定で設計を進めていたが、思いのほかOpenSeaの共有コントラクトを使用している二次創作コレクションが多く、特定のコレクションを持っているかどうかの判定に苦労している
We were designing under the assumption that there is one contract address per NFT collection, but unexpectedly there are many secondary collections that use OpenSea shared contracts, and we are having difficulty determining whether or not we have a particular collection.

## NEXT
- フロントでの親子関係追加機能の実装
- フロントでのビジュアライズ機能の実装
- UIの最適化
- トークンエコノミクスによるapproveインセンティブの設計

- Implementation of the function to add parent-child relationships at the front desk
- Implementation of front-end visualization functionality
- UI optimization
- Design of approve incentives by token economics
