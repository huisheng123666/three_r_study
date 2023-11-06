## three.js 笔记

## 衡量前一帧花了多长时间

```
import { Clock } from 'three';

const clock = new Clock();

const delta = clock.getDelta();
```
