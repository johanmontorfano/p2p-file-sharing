let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
let VM_disable_syntax_in_imode =  0 
let VM_case_setting = ""
let NvimTreeSetup =  1 
let VM_mouse_mappings =  0 
let VM_debug =  0 
let VM_check_mappings =  1 
let VM_default_mappings =  1 
let VM_persistent_registers =  0 
let VM_live_editing =  1 
let VM_use_python =  0 
let VM_reselect_first =  0 
let VM_highlight_matches = "underline"
let NvimTreeRequired =  1 
let Coc_tsserver_path = "C:\\Users\\ifexi\\AppData\\Local\\coc\\extensions\\node_modules\\coc-tsserver\\node_modules\\typescript\\bin\\tsc"
let VM_use_first_cursor_in_line =  0 
silent only
silent tabonly
cd ~/Documents/projects/rawshare
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +30 ~/Documents/projects/rawshare/README.md
badd +0 term://~/Documents/projects/rawshare//29812:powershell
argglobal
%argdel
edit ~/Documents/projects/rawshare/README.md
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
wincmd =
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 30 - ((29 * winheight(0) + 28) / 57)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 30
normal! 026|
wincmd w
argglobal
if bufexists(fnamemodify("term://~/Documents/projects/rawshare//29812:powershell", ":p")) | buffer term://~/Documents/projects/rawshare//29812:powershell | else | edit term://~/Documents/projects/rawshare//29812:powershell | endif
if &buftype ==# 'terminal'
  silent file term://~/Documents/projects/rawshare//29812:powershell
endif
balt ~/Documents/projects/rawshare/README.md
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 37 - ((36 * winheight(0) + 28) / 57)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 37
normal! 0
wincmd w
wincmd =
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
