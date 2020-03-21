# Clojure.JS

An experimental version of Clojure written in MiniClojure written in Javascript

## Wait, what?

Clojure is a language made to work on other environments. But there's a problem: it is quite hard to make a new implementation of Clojure for a new environment: first of all, there's no oficial guide, and also the oficial implementations don't have an extensive test suite that we can use.

So, the idea of this implementation is to make easier to port Clojure: by writting a "mini-clojure" implementation, adding just the right amount of features so it can interpret a simplified version of `clojure.tools.reader` and `clojure.tools.analyser`, and using these two files to parse programs.

Then, it is just a matter of implementing a compiler for the new target.

## Will it work?

We'll see.

## License

MIT License
