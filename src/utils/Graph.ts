export type node = string | number;
export const nullNode = Symbol("nullNode");
export type nodeOrNullNode<N extends node> = typeof nullNode | N;
export type arc<N extends node> = [N, N];
export type edge<N extends node> = arc<N>;
export type weightedEdge<N extends node> = [...edge<N>, number];

export class Graph<N extends node = node> {
  readonly adj: Map<N, Set<N>>;

  constructor(adj?: Map<N, Set<N>>) {
    if (adj instanceof Map) {
      this.adj = adj;
    } else this.adj = new Map();
  }

  /**
   * @description Add a node to the graph
   * @param n A node of the graph
   */
  addNode(n: N): this {
    if (!this.adj.has(n)) this.adj.set(n, new Set());
    return this;
  }

  /**
   * @description Add an arc from node n1 to node n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  addArc(n1: N, n2: N): this {
    this.addNode(n1);
    this.addNode(n2);
    this.adj.get(n1)?.add(n2);
    return this;
  }

  /**
   * @description Remove an arc from node n1 to node n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  removeArc(n1: N, n2: N): this {
    this.adj.get(n1)?.delete(n2);
    return this;
  }

  /**
   * @description Add an edge between two nodes n1 and n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  addEdge(n1: N, n2: N): this {
    this.addArc(n1, n2);
    this.addArc(n2, n1);
    return this;
  }

  /**
   * @description Remove an edge between two nodes n1 and n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  removeEdge(n1: N, n2: N): this {
    this.removeArc(n1, n2);
    this.removeArc(n2, n1);
    return this;
  }

  /**
   * @description Check the existence of an arc between two nodes n1 and n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  arc(n1: N, n2: N): boolean {
    return !!this.adj.get(n1)?.has(n2);
  }

  /**
   * @description Check the existence of an edge between n1 and n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  edge(n1: N, n2: N): boolean {
    return this.arc(n1, n2) && this.arc(n2, n1);
  }

  /**
   * @description Test wether n1 and n2 are adjacent
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  adjacent(n1: N, n2: N): boolean {
    return this.arc(n1, n2) || this.arc(n2, n1);
  }

  /**
   * @description The nodes of the graph
   */
  get nodesIterator(): IterableIterator<N> {
    return this.adj.keys();
  }

  /**
   * @description The nodes of the graph
   */
  get nodes(): N[] {
    return Array.from(this.nodesIterator);
  }

  /**
   * @returns The order of the graph
   */
  get ordre(): number {
    return this.adj.size;
  }

  /**
   * @returns The neighbors of the node n
   * @param n A node of the graph
   */
  neighborsIterator(n: N): IterableIterator<N> | undefined {
    return this.adj.get(n)?.values();
  }

  /**
   * @returns The neighbors of the node n
   * @param n A node of the graph
   */
  neighbors(n: N): N[] {
    return Array.from(this.neighborsIterator(n) ?? []);
  }

  /**
   * @returns The degree of the node n
   * @param n A node of the graph
   */
  degree(n: N): number {
    return this.adj.get(n)?.size ?? 0;
  }

  /**
   * @returns The edges of the graph
   */
  get edges(): edge<N>[] {
    const edges: edge<N>[] = [];
    const n = this.nodes;
    for (let x = 0; x < n.length; x++) {
      for (let y = x; y < n.length; y++) {
        if (this.edge(n[x], n[y])) edges.push([n[x], n[y]]);
      }
    }

    return edges;
  }

  /**
   * @returns The arcs of the graph
   */
  get arcs(): edge<N>[] {
    const arcs: edge<N>[] = [];
    const n = this.nodes;
    for (const n1 of n) {
      for (const n2 of n) {
        if (this.arc(n1, n2)) arcs.push([n1, n2]);
      }
    }

    return arcs;
  }

  /**
   * @description A list including the nodes that are connected (source or target) with the node n
   * @param n A node of the graph
   */
  connections(n: N): N[] {
    return this.nodes.filter((n1) => this.adjacent(n, n1));
  }
}

export type weightKey<N extends node> = `${N}-${N}`;
export class WeightedGraph<N extends node = node> extends Graph<N> {
  readonly weights: Map<weightKey<N>, number>;

  constructor(adj?: Map<N, Set<N>>, weights?: Map<weightKey<N>, number>) {
    if (adj instanceof Map && weights instanceof Map) {
      super(adj);
      this.weights = weights;
    } else {
      super();
      this.weights = new Map();
    }
  }

  /**
   * @description Add an arc from node n1 to node n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   * @param w The weight of this arc
   */
  addArc(n1: N, n2: N, w = 0): this {
    super.addArc(n1, n2);
    this.weights.set(`${n1}-${n2}`, w);
    return this;
  }

  /**
   * @description Remove an arc from node n1 to node n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  removeArc(n1: N, n2: N): this {
    super.removeArc(n1, n2);
    this.weights.delete(`${n1}-${n2}`);
    return this;
  }

  /**
   * @description Add an edge between two nodes n1 and n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   * @param w The weight of this arc
   */
  addEdge(n1: N, n2: N, w?: number): this {
    this.addArc(n1, n2, w);
    this.addArc(n2, n1, w);
    return this;
  }

  /**
   * @description Remove an edge between two nodes n1 and n2
   * @param n1 A node of the graph
   * @param n2 A node of the graph
   */
  removeEdge(n1: N, n2: N): this {
    this.removeArc(n1, n2);
    this.removeArc(n2, n1);
    return this;
  }

  weight(n1: N, n2: N): number {
    if (!this.arc(n1, n2)) throw new Error("Invalid nodes");
     
    return this.weights.get(`${n1}-${n2}`)!;
  }
}

export type KeyOfMap<M extends Map<unknown, unknown>> = M extends Map<
  infer K,
  unknown
>
  ? K
  : never;
export type unpackGraphNode<G> = G extends Graph ? KeyOfMap<G["adj"]> : never;
