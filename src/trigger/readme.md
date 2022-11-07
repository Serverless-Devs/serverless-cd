

## pipline yaml 配置

```
name: "On Push master"
triggers:
  github:
    secret: test
    events:
      - eventName: "push"
        filter: 'body.ref in ["refs/heads/tes"]'
    manual_dispatch:
      secret: test
env:
  name: Heimanba
  age: 30
steps:
  - run: echo 'Hi {{ env.name }}'  # Hi Heimanba
  - run: echo 'Hi {{ env.name }}'  # Hi Tony
    env:
      name: Tony
```
