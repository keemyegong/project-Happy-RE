package org.example;

import org.w3c.dom.NodeList;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class Main {

    static class Node implements Comparable<Node> {
        int num;
        int val;
        public Node(int num, int val){
            this.num = num;
            this.val = val;
        }

        @Override
        public int compareTo(Node o) {
            if(this.val == o.val){
                return this.num - o.num;
            }
            return this.val - o.val;
        }
        @Override
        public String toString() {
            return "Node [num=" + num + ", val=" + val + "]";

        }
        @Override
        public boolean equals(Object o) {
            return this.num == ((Node)o).num;
        }

    }

    static int N,K;
    static int arr[];
    static int graph[][];
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer tk = new StringTokenizer(br.readLine());

        N = Integer.parseInt(tk.nextToken());
        K = Integer.parseInt(tk.nextToken());
        ArrayList<Node> nodeList = new ArrayList<>();
        for (int i = 0; i <= N; i++) {
            nodeList.add(new Node(i, 0));
        }
        nodeList.get(0).val = Integer.MAX_VALUE-1;

        //인접리스트 귀찮
        graph = new int[N+1][N+1];

        for (int i = 0; i < K; i++) {
            tk = new StringTokenizer(br.readLine());
            int l = Integer.parseInt(tk.nextToken());
            Integer pre = null;
            for (int j = 0; j < l; j++) {
                int tmp = Integer.parseInt(tk.nextToken());
                if(pre == null) {pre = tmp;continue;}
                if(graph[pre][tmp] == 0){
                    graph[pre][tmp]++;
                    nodeList.get(tmp).val++;
                }

                pre=tmp;
            }
        }

        //원래pq값바뀌면 정렬 다시 안해줬었나
        //트리셋도 안되네
        TreeSet<Node> pq  =  new TreeSet<>();

        for (int i = 1; i <= N; i++) {
            pq.add(nodeList.get(i));
        }
        ArrayList<Integer> ans = new ArrayList<>();
        while (!pq.isEmpty()) {
            Node node = pq.pollFirst();
            //System.out.println(pq.toString());
            //System.out.println(node);
            if(node.val != 0 ) {
                System.out.println(0);
                return;
            }
            ans.add(node.num);
            for (int i = 1; i <= N; i++) {
                if(graph[node.num][i] > 0) {
                    nodeList.get(i).val--;
                }
            }
            TreeSet<Node> tmp = new TreeSet<>();
            while (!pq.isEmpty()) {
                tmp.add(pq.pollFirst());
            }
            pq = tmp;

        }
        for (int i = 0; i < N; i++) {
            System.out.println(ans.get(i));
        }
    }
}