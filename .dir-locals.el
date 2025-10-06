((tsx-ts-mode
  . ((eval . (progn
               ;; Auto LSP
               (lsp-deferred)
               ;; Keybindings
               (map!
                :n "g c c" #'jtsx-comment-line
                :v "g c"   #'jtsx-comment-dwim))))))
