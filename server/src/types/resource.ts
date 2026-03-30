export interface Resource {
    /*
        Represents a resource item that can be recommended by
        the chatbot to a user based on context and preferences.
    */
    id:             string;
    title:          string;    // Human-readable title to be displayed in front-end.
    url:            string;    // Link to the resource, article, tool, etc.
    description:    string;    // A short description explaining what the resource offers.

    type: "article" | "video" | "tool" | "exercise" | "course" | "community";

    topics: string[];
    // Broad topics covered. Used for relevance matching.
    // Ex. 'depression', 'anxiety', 'stress management'.

    tags: string[];
    // More granular keywords for searching and filtering.
    // Ex. 'breathing', 'mindfulness', 'calm'
    
    targetStates: string[];
    // Phrases to match certain behaviours users are experiencing.
    // Ex. 'feeling anxious', 'overthinking'.

    timeEstimate?: number;   // An estimation of time (in minutes) for how long it takes to consume said resource.

    accessLevel: "low" | "med" | "high";
    // How easy is it to access the resource?
    // A video might be pretty easy to access, compared to a course, 
    // which might be harder to access.

    credibilityLevel?: "low" | "med" | "high";
    // How credible is this resource?
    // A government resource might be more credible
    // compared to a video on YouTube.
    // Maybe, we shouldn't have this attribute because it implies
    // that we are serving resources to users that aren't credible.

    embedding: number[]; // Vector embedding for a vector db similarity search.
}


export interface ResourceImpression {
    /*
        The impression that any single user has left on a single resource.

        Clicks on links to resources and favourites should leave
        higher than those whom the user has not interacted with.
    */
    userId:         string; // Id of user who has interacted with the reference.
    resourceId:     string; // Reference to resource.
    shownAt:        Date;

    linkClickedByUser:  boolean;
    userFavourited?:    boolean;
    feedback?: "helpful" | "not_helpful"; // Don't need to implement this, but it's here.
}