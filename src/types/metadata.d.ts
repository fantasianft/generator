type Metadata = {
    name: string;
    description: string;
    image: string;
    dna: string;
    edition: number;
    date: number;
    attributes: {
        trait_type: string;
        value: string;
    }[];
    // solana creators metadata
    creators?: {
        address: string;
        share: number;
    }[]
}

export {Metadata};