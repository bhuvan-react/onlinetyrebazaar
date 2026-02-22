package com.tyreplus.dealer.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SinglePageAppController {

    /**
     * Forwards all non-API requests to index.html to allow client-side routing.
     * Excludes: /api/**, /static/**, *.* (files with extensions)
     */
    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}
