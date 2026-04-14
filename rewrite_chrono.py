import re

content = open('src/games/components/Chrono.tsx', 'r', encoding='utf-8').read()

new_list = """          <Reorder.Group
            values={events}
            onReorder={setEvents}
            className="flex-1 flex flex-col gap-2 relative z-10"
            axis="y"
          >
            {events.map((event, i) => (
              <Reorder.Item
                key={event.id}
                value={event}
                dragListener={!event.locked}
                dragControls={undefined}
                whileDrag={{ scale: 1.03, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="cursor-grab active:cursor-grabbing z-10 relative"
              >
                <div
                  className="rounded-2xl overflow-hidden transition-colors duration-150"
                  style={{
                    background: event.status === 'correct' ? '#F0FDF4' : event.status === 'wrong' ? '#FEF2F2' : '#FFFFFF',
                    border: event.status === 'correct'
                      ? '1.5px solid #BBF7D0'
                      : event.status === 'wrong'
                      ? '1.5px solid #FECACA'
                      : '1.5px solid #E3DDD5',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 px-3 py-3">
                    {/* Drag Handle Indicator */}
                    <div className="flex flex-col gap-0.5 opacity-40 px-1 py-1 rounded pointer-events-none">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#78716C' }} />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#78716C' }} />
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#78716C' }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pointer-events-none">
                      {event.locked && (
                        <span
                          className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full mb-1"
                          style={{ background: '#FCD34D', color: '#78350F', fontFamily: 'Plus Jakarta Sans, system-ui' }}
                        >
                          {event.dateLabel}
                        </span>
                      )}
                      <p
                        className="text-[13px] font-semibold leading-snug"
                        style={{
                          color: event.status === 'correct' ? '#166534' : '#1C1917',
                          fontFamily: 'Plus Jakarta Sans, system-ui',
                        }}
                      >
                        {event.label}
                      </p>
                    </div>

                    {/* Status icons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {event.status === 'correct' && <CheckCircle size={16} color="#16A34A" />}
                      {event.factoid && (
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => setActiveFactoid(activeFactoid === event.id ? null : event.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black pointer-events-auto"
                          style={{ background: '#F0EEE9', color: '#78716C', fontFamily: 'Inter, system-ui' }}
                        >
                          i
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Factoid */}
                  {activeFactoid === event.id && event.factoid && (
                    <div className="px-4 pb-3 pointer-events-none">
                      <div className="rounded-xl px-3 py-2" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                        <p className="text-[12px] leading-relaxed" style={{ color: '#92400E', fontFamily: 'Inter, system-ui' }}>
                          {event.factoid}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>"""

new_content = re.sub(
    r'<div className="flex-1 flex flex-col gap-2">.*?</div>\s*</div>\s*</div>\s*\{\/\* Footer \*/\}',
    new_list + '\n        </div>\n      </div>\n\n      {/* Footer */}',
    content,
    flags=re.DOTALL
)

open('src/games/components/Chrono.tsx', 'w', encoding='utf-8').write(new_content)
print("Updated successfully")
