---
title: 'OS개발 - Paging(0)'
description: '기초적인 구현'
pubDate: 'May 06 2025'
#updatedDate: ''
heroImage:
  src: '/blog-placeholder-4.jpg'
  alt: ''
tags: ["Operating System", "OS", "osdev.org", "Tutorial",]
series: "OSDev 따라잡기"
---

# [Paging](https://wiki.osdev.org/Paging)

키보드 드라이버를 구현하기에 앞서서 paging을 구현하기로 하였다.
메모리 관련 부분을 미리 구현해놔야 앞으로의 작업이 편해질 것 같다는 생각에서 였다.
가상 주소까지 구현하는게 목표였지만, 시간과 지력, 의지의 부족으로 물리주소에 대한 paging만 구현하게 되었다.
수업을 들을 때는 이해가 쑥쑥 되었지만 직접 구현하고 운영하려니 여간 복잡한게 아니다.
상당히 간단하게, 나이브하게 구현하였는데 가상 주소에 대한 부분을 구현하기 전에 공부를 더 많이 해야 겠다.

Segment를 이용한 메모리 관리 시스템에서 벗어나 더 효율적으로 메모리를 관리하기 위해 등장한 방법이 paging이다.
메모리를 동일한 크기를 가진 여러개의 작은 page로 나누어 해당 page를 메모리 주소에 mapping하여 사용하는 방식이다.
Page별로 권한을 조정할 수 있고, page의 사용여부를 관리할 수 있다는 점은 segment와 비슷하다.
다만 page는 실제로 필요한 메모리 용량에 근접하게 할당해줄 수 있기 때문에 segment에 비해 낭비가 적다.
또한, 프로그램이 참조한 주소를 page directory와 page table을 바탕으로 재조합해 접근하게 되는데
이러한 과정이 가진 abstract한 측면 덕분에 가상 주소를 사용할 수 있게 되었다.
가상 주소를 사용하게 되면, 불연속한 메모리 사용을 연속적인 메모리 사용으로 변환하여 메모리의 낭비를 막을 수 있다.
예를 들어 어떤 프로그램이 0x20 ~ 0x25 구간의 메모리와 0x50 ~ 0x58 구간의 메모리를 사용한다고 하자.
Paging을 사용하지 않으면, 해당 프로그램이 동작하기 위해선 0x20 ~ 0x58 구간의 56바이트 메모리를 확보해야 한다.
그러나 paging을 사용하게 되면, 실제로 사용하는 14바이트의 물리메모리만 확보하면 사용할 수 있다.
Page의 크기가 메타 데이터의 존재를 고려하지 않은 가정이지만, paging의 이점을 표현하기 위한 좋은 예라고 할 수 있다.
메모리 관리 효율을 높여주는 paging을 구현하기 위해선, 
page frame allocator와 page table, page directory 등의 메타데이터를 구현해야 한다.

## [Page Frame Allocator](https://wiki.osdev.org/Page_Frame_Allocation)

Paging은 가상주소와 물리주소의 mapping이다.
이러한 mapping은 4KB 단위로 이루어진다. 따라서, 이 4KB짜리 page frame을 관리해야할 필요가 생긴다.
사용하지 않는 page frame을 할당하고, 사용 중인 page frame을 회수하는 시스템이 필요하다.

32bit 주소를 사용하는 시스템에서는 메모리의 크기가 최대 4GB(0x100000000 bytes)이다.
이를 4KB(0x1000 bytes)씩 나누게 되면 총 1048576(0x100000)개의 frame이 나온다.
이 frame들을 bitmap통해 표현해 사용여부를 표현할 것이다.
32bit 짜리 uint32_t에 32개의 frame의 사용여부를 담을 것이다.
따라서 총 32768 바이트의 bitmap이 이용되게 된다.

Frame이 할당되면 해당하는 비트를 1로 하고, 사용이 해지 되면 해당하는 비트를 0으로 한다.

```c
static inline void useFrame(uint32_t idx) {
  frames.bitmap[idx / 32] |= (1 << idx % 32);
}

static inline void unuseFrame(uint32_t idx) {
  frames.bitmap[idx / 32] &= ~(1 << (idx % 32));
}

static inline uint32_t isusedFrame(uint32_t idx) {
  return frames.bitmap[idx / 32] & (1 << (idx % 32));
}

static uint32_t allocFrame() {
  uint32_t fidx = frames.lastIdx;
  for (; isusedFrame(fidx); ++fidx) {
    if (fidx == MAX_FRAMES) {
      return NO_AVAIL_FRAME;
    }
  }

  useFrame(fidx);
  frames.lastIdx = fidx;

  return fidx * FRAME_SIZE;
}

```

Free하는 부분은 아직 구현을 못했다.
Free된 frame들을 큐나 연결리스트로 관리하여 빠르게 재할당이 이루어지게 하는 방안을 생각 중에 있다.

## Page Directory & Page Table

x86의 memory management unit(MMU)은 page directory와 page table이라는 메타데이터를 참조하여 주소를 변환한다.
각 page들의 mapping정보는 page table에 담기게 된다.
해당 page가 읽을 수 있는지, 쓸 수 있는지, 현재 사용 중인 page인지 등의 속성 정보와
해당 page의 실제 물리 주소가 담겨 있다.
Page가 4KB의 크기를 가지고 있기 때문에, 논리 주소의 0번째 ~ 11번째 비트는 해당 page내에서의 offset으로 역할한다.
12번째 ~ 31번째 비트를 바탕으로 page table내의 entry를 찾는 index의 역할을 수행한다.
만약 0x12345의 논리 주소를 변환하게 된다면, (0x12번째 entry에 적힌 물리주소) + 0x345가 변환된 물리 주소가 된다.
Table정보들은 directory에 담기게 되는데, 남은 20개의 비트를 중 작은 10개의 비트로 table내의 indexing을 하고,
나머지 10개의 비트로 directory내의 indexing을 한다.
따라서 directory 정보가 시스템 전체의 paging 정보를 담고 있는 것이다.
이 directory 위치를 mmu에 넘겨주는 과정을 통해 paging을 활성화할 수 있다.

정리해보면, 가상주소는 (direcotory내의 table의 index) + (table내의 page의 index) + offset으로 구성되어 있다.
Directory와 table에는 각각 table과 page의 현재 정보를 나타내는 entry들이 존재한다.
Directory는 table이 위치해 있는 물리주소와 table의 상태(present, accessed, dirty 등)을 기록한다.
Table은 page가 위치해 있는 물리주소와 page의 상태를 기록한다.
x86에서는 cr3 레지스터에 directory의 물리주소를 저장한다.
해당 주소를 바탕으로 가상주소를 물리주소로 변환하게 되며, 해당 접근이 올바른지 판단하게 된다.
만약, 상태에 맞지 않은 접근이 이루어질 경우 page fault(14) exception이 발생하게 된다.
해당 exception을 처리하는 로직은 다음에 구현하도록 하겠다.

## Initialization

내가 구상한 초기화 로직은 다음과 같다.

1. page frame관련 자료구조를 초기화한다.
2. 커널 데이터와 코드가 들어간 page들에 대하여 frame을 할당한다.
3. directory가 사용할 frame을 할당한다.
4. 커널 관련 page들이 담길 table과 paging 관련 메타데이터(directory, table) page들이 담길 table에 대한 frame을 할당한다.
5. 커널 관련 page들의 메타데이터 작성을 한다.
6. paging 관련 page들의 메타데이터 작성을 한다.
7. 관련 레지스터 세팅을 한다. (cr3에 directory 주소 전달, cr0의 paging 활성화 비트 세팅)
8. paging 자료구조에 접근할 수 있도록 가상주소를 저장해둔다.

이를 코드로 옮기면 아래와 같다.

```c
static void initFrames(uint32_t ptr) {
  frames.start = (ptr / FRAME_SIZE + 1) * FRAME_SIZE;
  for (uint32_t fidx = 0; fidx * FRAME_SIZE <= frames.start; ++fidx) {
    useFrame(fidx);
    frames.lastIdx = fidx;
  }

  memset(frames.bitmap, 0, sizeof(uint32_t) * N_BITMAP_ENTRY);
}

void initPaging() {
  initFrames(&endkernel);

  // make page directory (directory dwells on first page)
  uint32_t *dict = (uint32_t *)allocFrame();
  for (uint32_t i = 0; i < N_TABLE_ENTRY; ++i) {
    dict[i] = PAGE_RW;
  }

  // make first page tables(first table dwells on second page)
  // pagetable의 frame들은 두번째 pagetable에 mapping한다.
  // 0번째 table => kernel
  // 1번째 table => table info
  uint32_t *firstTable = (uint32_t *)allocFrame(),
           *secondTable = (uint32_t *)allocFrame();
  memset(firstTable, 0, sizeof(uint32_t) * N_PAGE_ENTRY);
  memset(secondTable, 0, sizeof(uint32_t) * N_PAGE_ENTRY);

  // kernel pages
  dict[0] = PAGE_PADDR((uint32_t)firstTable) | PAGE_RW | PAGE_PRESENT;
  for (uint32_t addr = 0; addr <= (uint32_t)frames.start; addr += FRAME_SIZE) {
    firstTable[PAGE_PIDX(addr)] = PAGE_PADDR(addr) | PAGE_RW | PAGE_PRESENT;
  }

  // table pages
  tables = secondTable;
  dict[1] = PAGE_PADDR((uint32_t)secondTable) | PAGE_RW | PAGE_PRESENT;
  secondTable[0] = PAGE_PADDR((uint32_t)dict) | PAGE_RW | PAGE_PRESENT;
  secondTable[1] = PAGE_PADDR((uint32_t)firstTable) | PAGE_RW | PAGE_PRESENT;
  secondTable[2] = PAGE_PADDR((uint32_t)secondTable) | PAGE_RW | PAGE_PRESENT;
  // set register to enable paging
  setPageRegs(dict);
  directory = (uint32_t *)PAGE_2_ADDR(1, 0);
  tables = (uint32_t *)PAGE_2_ADDR(1, 2);
  nextAddr = PAGE_2_ADDR(2, 0);
}

```

첫번째 table에는 커널 관련 page들에 관한 내용을 담아 커널 코드 및 데이터는 물리주소와 가상주소를 일치시켰다.
두번째 table에는 table들이 위치한 page들을에 관한 내용을 담았다.
따라서, 새로 할당될 page는 세번째 table의 주소들부터 시작되게 된다. 

## Allocation

어떤 가상주소에 대한 할당요청이 들어올 경우 수행할 로직은 다음과 같다.

1. 해당 주소의 table의 index와 page의 index를 각각 구한다.
2. table이 present한지 조사하고,
   present하지 않으면 해당 table의 frame을 할당하고 이를 table의 table(2번째 table)과 directory에 기록한다.
3. 빈 frame을 할당한다.
4. frame의 물리주소와 속성을 조합하여 table entry를 설정한다.

이를 코드로 옮기면 아래와 같다. 

```c
uint32_t kallocPage() {
  uint32_t result = __allocPage(nextAddr);
  nextAddr += FRAME_SIZE;
  return result;
}

static pageframe_t __allocPage(uint32_t vaddr) {
  uint32_t tidx = PAGE_TIDX(vaddr), pidx = PAGE_PIDX(vaddr), *table;
  if (!(directory[tidx] & PAGE_PRESENT)) {
    uint32_t tframe = allocFrame();
    directory[tidx] = tframe | PAGE_RW | PAGE_PRESENT;
    tables[tidx + 1] = tframe | PAGE_RW | PAGE_PRESENT;
  }

  table = (uint32_t *)PAGE_2_ADDR(PAGE_TABLE_TIDX, PAGE_TABLE_PIDX(tidx));
  table[pidx] = allocFrame() | PAGE_RW | PAGE_PRESENT;

  return vaddr;
}
```

## Free

할당된 page를 free하는 로직은 다음과 같다.

1. table에서 present 비트를 0으로 설정한다.
2. 할당된 frame을 free한다,.
3. page관련 레지스터(cr3)을 재설정한다.

cr3를 재설정하는 이유는 TLB 캐시 때문이다.
Page mapping 정보를 TLB 캐시에 저장해 빠르게 변환하도록 하는데,
directory 및 table의 정보를 수정하여도 TLB에는 수정 전 정보로 남아 있을 수 있기 때문에 TLB를 clear해주어야 한다.
x86의 경우에는 cr3 레지스터를 갱신해주는 것을 갈음하게 된다.

```c
void kfreePage(uint32_t vaddr) { __freePage(vaddr); }

static void __freePage(uint32_t vaddr) {
  uint32_t tidx = PAGE_TIDX(vaddr), pidx = PAGE_PIDX(vaddr), *table, paddr;
  table = (uint32_t *)PAGE_2_ADDR(PAGE_TABLE_TIDX, PAGE_TABLE_PIDX(tidx));
  table[pidx] = table[pidx] & ~PAGE_PRESENT;
  paddr = PAGE_PADDR(table[pidx]);
  freeFrame(paddr);

  flushPageRegs();
}
```