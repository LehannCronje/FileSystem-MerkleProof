use std::borrow::Borrow;

use crate::File;

#[derive(Clone, Debug)]
struct Node {
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
    hash: Option<String>,
    parent: Option<Box<Node>>,
    content: Option<Box<Content>>,
}

impl From<Node> for Option<Box<Node>> {
    fn from(node: Node) -> Self {
        Some(Box::new(node))
    }
}


impl Node {
    fn new() -> Self {
        Node {
            left: None,
            right: None,
            hash: None,
            parent: None,
            content: None,
        }
    }
}
#[derive(Clone, Debug)]
pub struct Content {
    base64: String,
    name: String
}

pub struct MerkleTree {
    root: Node,
    leafs: Vec<Node>,
    merkle_root_hash: String
}

struct ProofNode {
    hash: String,
    direction: String
}


impl MerkleTree {
    pub fn create(files: Vec<File>) -> MerkleTree {

    }

    fn build(children: &mut Vec<Node>) -> Node {
        let parents: &mut Vec<Node> =  &mut Vec::new();

        if children.len() == 1 {
            return children[0].clone();
        };

        let index = 0;
        let lenght = children.len();

        while index < lenght {
            let left_child = &children[index];
            let mut right_child = &mut Node::new();
            if (index + 1) < lenght {
                right_child = &mut children[index + 1];
            } else {
                right_child = &mut Node {
                    left: None,
                    right: None,
                    hash: left_child.hash.clone(),
                    parent: left_child.parent.clone(),
                    content: None,
                };
            }
        }
        return Node::new();
    }

    pub fn getProof(hash: String) -> Vec<ProofNode> {
        
    }
}